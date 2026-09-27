import type { Accessor } from "solid-js";
import { Index, createEffect, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";

import {
    CLOCK_DEFAULTS,
    type ClockColumn,
    type ClockRenderProps,
    type ClockSteps,
    type ClockUnit,
    ClockUtils,
    ClockStyles as styles,
} from "@thewaver/ss-components";
import type { TimeValue } from "@thewaver/ss-utils";

import { NavigatorSolidUtils } from "../../../Abstracts/Navigator/NavigatorSolid.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { access, accessSignal } from "../../../Utils/propUtils";
import type { ClockOptionProps, ClockProps } from "./ClockSolid.types";

const NO_CLOCK_STEPS: ClockSteps = {};

const ClockOptionControl = (props: ClockOptionProps) => {
    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    return (
        <div
            id={access(props.id)}
            ref={(element) => props.ref?.(element)}
            class={styles.clockOption}
            role="option"
            aria-label={access(props.ariaLabel)}
            aria-selected={access(props.flags).isSelected}
            aria-current={access(props.flags).isNow ? "time" : undefined}
            aria-disabled={getIsDisabled() || undefined}
            onClick={() => {
                if (getIsDisabled()) return;

                props.onSelect();
            }}
        >
            {props.renderContent(() => access(props.flags))}
        </div>
    );
};

export const Clock = (props: ClockProps) => {
    const valueSignal = accessSignal(() => props.valueSignal);

    const groupId = createUniqueId();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const optionRefs = new Map<string, HTMLElement>();
    const [getHighlighted, setHighlighted] = createSignal<TimeValue | undefined>();
    const [getHighlightedUnit, setHighlightedUnit] = createSignal<ClockUnit | undefined>();

    const getDirection = NavigatorSolidUtils.createDirectionSignal(getRootRef);

    const getIsTwelveHour = createMemo(() => access(props.isTwelveHour) ?? false);

    const getHasSeconds = createMemo(() => access(props.hasSeconds) ?? false);

    const getGap = () => `${access(props.gap) ?? CLOCK_DEFAULTS.gap}px`;

    const getNow = createMemo(() => access(props.now) ?? ClockUtils.fromDate(new Date()));

    const getBase = createMemo(() =>
        ClockUtils.computeBase(
            valueSignal[0](),
            getNow(),
            getHasSeconds(),
            access(props.minValue),
            access(props.maxValue),
        ),
    );

    const getUnits = createMemo(() => ClockUtils.getUnits(getHasSeconds(), getIsTwelveHour()));

    const getMeridiemNames = createMemo(() => ClockUtils.getMeridiemNames(access(props.locale)));

    const getColumns = createMemo(() =>
        ClockUtils.getColumns(
            getUnits(),
            getBase(),
            getIsTwelveHour(),
            access(props.steps) ?? NO_CLOCK_STEPS,
            getMeridiemNames(),
        ),
    );

    const getRovingTime = createMemo(() => getHighlighted() ?? getBase());

    const getRovingUnit = createMemo(() => ClockUtils.resolveRovingUnit(getHighlightedUnit(), getUnits()));

    const getRovingIndex = (column: ClockColumn) =>
        ClockUtils.getRovingIndex(column, getRovingTime(), getIsTwelveHour());

    const getIsTimeDisabled = (time: TimeValue) =>
        ClockUtils.getIsTimeDisabled(time, {
            isDisabled: access(props.isDisabled),
            minValue: access(props.minValue),
            maxValue: access(props.maxValue),
            computeIsTimeDisabled: props.computeIsTimeDisabled,
        });

    const setOptionRef = (unit: ClockUnit, index: number, element: HTMLElement) => {
        const key = `${unit}:${index}`;

        optionRefs.set(key, element);

        onCleanup(() => {
            if (optionRefs.get(key) === element) optionRefs.delete(key);
        });
    };

    const pick = (time: TimeValue, unit: ClockUnit) => {
        if (getIsTimeDisabled(time)) return;

        setHighlighted(() => time);
        setHighlightedUnit(unit);
        valueSignal[1](() => time);
    };

    createEffect(() => {
        const value = valueSignal[0]();

        if (!value) return;

        setHighlighted(() => value);
    });

    createEffect(() => {
        getColumns().forEach((column) => {
            optionRefs.get(`${column.unit}:${getRovingIndex(column)}`)?.scrollIntoView({ block: "nearest" });
        });
    });

    createEffect(() => {
        const column = getColumns().find((candidate) => candidate.unit === getRovingUnit());
        const element = column && optionRefs.get(`${column.unit}:${getRovingIndex(column)}`);
        const root = getRootRef();

        if (!element || !root?.contains(document.activeElement) || root === document.activeElement) return;

        element.focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        const action = ClockUtils.computeKeyAction(e.key, {
            columns: getColumns(),
            rovingUnit: getRovingUnit(),
            rovingTime: getRovingTime(),
            isTwelveHour: getIsTwelveHour(),
            direction: getDirection(),
        });

        if (!action) return;

        e.preventDefault();

        if (action.kind === "pick") pick(action.time, action.unit);
        else if (action.kind === "highlight") setHighlighted(() => action.time);
        else setHighlightedUnit(action.unit);
    };

    const renderOptions = (getColumn: Accessor<ClockColumn>) => (
        <Index each={getColumn().options}>
            {(getOption, optionIndex) => {
                const getIsHighlighted = () =>
                    getColumn().unit === getRovingUnit() && optionIndex === getRovingIndex(getColumn());

                const getIsAt = (time: TimeValue | undefined) =>
                    ClockUtils.getIsAt(getColumn(), optionIndex, time, getIsTwelveHour());

                return (
                    <InteractionWrapper
                        sizing={"fill"}
                        isDisabled={() => getIsTimeDisabled(getOption().time)}
                        isFocusableWhenDisabled={() => !(access(props.isDisabled) ?? false)}
                        isTabbable={getIsHighlighted}
                        extraFlags={(): ClockRenderProps => ({
                            option: getOption(),
                            isSelected: getIsAt(valueSignal[0]()),
                            isNow: getIsAt(getNow()),
                            isHighlighted: getIsHighlighted(),
                        })}
                        ref={(element) => setOptionRef(getColumn().unit, optionIndex, element)}
                        renderControl={(setElementRef, getRenderProps) => (
                            <ClockOptionControl
                                ref={setElementRef}
                                id={() => `${groupId}-${getColumn().unit}-${optionIndex}`}
                                flags={getRenderProps}
                                ariaLabel={() => getOption().label}
                                renderContent={(getOptionFlags) => props.renderOption(getOption, getOptionFlags)}
                                onSelect={() => pick(getOption().time, getOption().unit)}
                            />
                        )}
                    />
                );
            }}
        </Index>
    );

    return (
        <div
            ref={setRootRef}
            id={groupId}
            class={styles.clockRoot}
            style={{ gap: getGap() }}
            role="group"
            aria-label={access(props.ariaLabel)}
            aria-disabled={access(props.isDisabled) || undefined}
            onKeyDown={handleKeyDown}
        >
            <Index each={getColumns()}>
                {(getColumn) => {
                    const getUnit = createMemo(() => getColumn().unit);
                    const getName = createMemo(() => ClockUtils.getUnitName(getUnit(), access(props.locale)));

                    return (
                        <div class={styles.clockColumn}>
                            <div class={styles.clockUnit} aria-hidden="true">
                                {props.renderUnit?.(getName(), getUnit())}
                            </div>

                            <div
                                class={styles.clockList}
                                style={{ gap: getGap() }}
                                role="listbox"
                                aria-label={getName()}
                                aria-disabled={access(props.isDisabled) || undefined}
                            >
                                {props.renderColumn?.(() => renderOptions(getColumn), getUnit()) ??
                                    renderOptions(getColumn)}
                            </div>
                        </div>
                    );
                }}
            </Index>
        </div>
    );
};
