import { type KeyboardEvent, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
    CLOCK_DEFAULTS,
    type ClockColumn,
    type ClockRenderProps,
    type ClockSteps,
    ClockStyles,
    type ClockUnit,
    ClockUtils,
    PopoverUtils,
} from "@thewaver/ss-components";
import type { TimeValue } from "@thewaver/ss-utils";

import { NavigatorReactUtils } from "../../../Abstracts/Navigator/NavigatorReact.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import type { ClockOptionProps, ClockProps } from "./Clock.types";

const NO_CLOCK_STEPS: ClockSteps = {};

const toOptionKey = (unit: ClockUnit, index: number) => `${unit}:${index}`;

const ClockOptionControl = (props: ClockOptionProps) => {
    const isDisabled = props.flags.isDisabled ?? false;

    return (
        <div
            id={props.id}
            ref={props.ref}
            className={ClockStyles.clockOption}
            role="option"
            aria-label={props.ariaLabel}
            aria-selected={props.flags.isSelected}
            aria-current={props.flags.isNow ? "time" : undefined}
            aria-disabled={isDisabled || undefined}
            onClick={() => {
                if (isDisabled) return;

                props.onSelect();
            }}
        >
            {props.renderContent(props.flags)}
        </div>
    );
};

export const Clock = (props: ClockProps) => {
    const [value, setValue] = props.value;

    const groupId = useId();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const optionRefs = useRef(new Map<string, HTMLElement>());
    const [highlighted, setHighlighted] = useState<TimeValue>();
    const [highlightedUnit, setHighlightedUnit] = useState<ClockUnit>();
    const [fallbackNow] = useState(() => ClockUtils.fromDate(new Date()));

    const direction = NavigatorReactUtils.useDirection(rootRef);

    const isTwelveHour = props.isTwelveHour ?? false;
    const hasSeconds = props.hasSeconds ?? false;
    const gap = `${props.gap ?? CLOCK_DEFAULTS.gap}px`;
    const now = props.now ?? fallbackNow;

    const base = ClockUtils.computeBase(value, now, hasSeconds, props.minValue, props.maxValue);
    const units = ClockUtils.getUnits(hasSeconds, isTwelveHour);
    const meridiemNames = useMemo(() => ClockUtils.getMeridiemNames(props.locale), [props.locale]);
    const columns = ClockUtils.getColumns(units, base, isTwelveHour, props.steps ?? NO_CLOCK_STEPS, meridiemNames);

    const rovingTime = highlighted ?? base;
    const rovingUnit = ClockUtils.resolveRovingUnit(highlightedUnit, units);

    const getRovingIndex = (column: ClockColumn) => ClockUtils.getRovingIndex(column, rovingTime, isTwelveHour);

    const getIsTimeDisabled = (time: TimeValue) =>
        ClockUtils.getIsTimeDisabled(time, {
            isDisabled: props.isDisabled,
            minValue: props.minValue,
            maxValue: props.maxValue,
            computeIsTimeDisabled: props.computeIsTimeDisabled,
        });

    const pick = (time: TimeValue, unit: ClockUnit) => {
        if (getIsTimeDisabled(time)) return;

        setHighlighted(time);
        setHighlightedUnit(unit);
        setValue(time);
    };

    useEffect(() => {
        if (value) setHighlighted(value);
    }, [value]);

    const rovingKeys = columns.map((column) => toOptionKey(column.unit, getRovingIndex(column)));
    const rovingKey = rovingKeys[units.indexOf(rovingUnit)];

    useEffect(() => {
        const root = rootRef.current;

        rovingKeys.forEach((key) => {
            const element = optionRefs.current.get(key);

            if (element && root) PopoverUtils.revealWithin(element, root);
        });
    }, [rovingKeys.join()]);

    useLayoutEffect(() => {
        const element = optionRefs.current.get(rovingKey);
        const root = rootRef.current;

        if (!element || !root?.contains(document.activeElement) || root === document.activeElement) return;

        element.focus();
    }, [rovingKey]);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const action = ClockUtils.computeKeyAction(e.key, { columns, rovingUnit, rovingTime, isTwelveHour, direction });

        if (!action) return;

        e.preventDefault();

        if (action.kind === "pick") pick(action.time, action.unit);
        else if (action.kind === "highlight") setHighlighted(action.time);
        else setHighlightedUnit(action.unit);
    };

    const renderOptions = (column: ClockColumn) =>
        column.options.map((option, optionIndex) => {
            const key = toOptionKey(column.unit, optionIndex);
            const isHighlighted = key === rovingKey;

            return (
                <InteractionWrapper<ClockRenderProps>
                    key={optionIndex}
                    sizing={"fill"}
                    isDisabled={getIsTimeDisabled(option.time)}
                    isFocusableWhenDisabled={!(props.isDisabled ?? false)}
                    isTabbable={isHighlighted}
                    extraFlags={{
                        option,
                        isSelected: ClockUtils.getIsAt(column, optionIndex, value, isTwelveHour),
                        isNow: ClockUtils.getIsAt(column, optionIndex, now, isTwelveHour),
                        isHighlighted,
                    }}
                    ref={(element) => {
                        if (element) optionRefs.current.set(key, element);
                        else optionRefs.current.delete(key);
                    }}
                    renderControl={(setElementRef, flags) => (
                        <ClockOptionControl
                            ref={setElementRef}
                            id={`${groupId}-${column.unit}-${optionIndex}`}
                            flags={flags}
                            ariaLabel={option.label}
                            renderContent={(optionFlags) => props.renderOption(option, optionFlags)}
                            onSelect={() => pick(option.time, option.unit)}
                        />
                    )}
                />
            );
        });

    return (
        <div
            ref={rootRef}
            id={groupId}
            className={ClockStyles.clockRoot}
            style={{ gap }}
            role="group"
            aria-label={props.ariaLabel}
            aria-disabled={props.isDisabled || undefined}
            onKeyDown={handleKeyDown}
        >
            {columns.map((column) => {
                const name = ClockUtils.getUnitName(column.unit, props.locale);

                return (
                    <div key={column.unit} className={ClockStyles.clockColumn}>
                        <div className={ClockStyles.clockUnit} aria-hidden="true">
                            {props.renderUnit?.(name, column.unit)}
                        </div>

                        <div
                            className={ClockStyles.clockList}
                            style={{ gap }}
                            role="listbox"
                            aria-label={name}
                            aria-disabled={props.isDisabled || undefined}
                        >
                            {props.renderColumn?.(() => renderOptions(column), column.unit) ?? renderOptions(column)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
