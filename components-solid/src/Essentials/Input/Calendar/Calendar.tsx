import { Index, Show, createEffect, createMemo, createSignal, createUniqueId, onMount } from "solid-js";

import {
    CALENDAR_DEFAULTS,
    type CalendarRenderProps,
    CalendarUtils,
    type DateValue,
    DateValueUtils,
    LiveAnnouncerUtils,
    CalendarStyles as styles,
} from "@thewaver/ss-components";

import { NavigatorSolidUtils } from "../../../Abstracts/Navigator/NavigatorSolid.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { access, accessSignal } from "../../../Utils/propUtils";
import type { CalendarCompositeProps, CalendarDayProps, CalendarProps } from "./CalendarSolid.types";

const CalendarDay = (props: CalendarDayProps) => {
    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    return (
        <div
            id={access(props.id)}
            ref={(element) => props.ref?.(element)}
            class={styles.calendarDay}
            role="gridcell"
            aria-label={access(props.ariaLabel)}
            aria-selected={access(props.flags).isSelected}
            aria-current={access(props.flags).isToday ? "date" : undefined}
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

export const CalendarComposite = (props: CalendarCompositeProps) => {
    onMount(() => LiveAnnouncerUtils.reserve("polite"));

    const monthSignal = accessSignal(() => props.month);

    const gridId = createUniqueId();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getHighlighted, setHighlighted] = createSignal<DateValue | undefined>();

    const getDirection = NavigatorSolidUtils.createDirectionSignal(getRootRef);

    const getPrecision = createMemo(() => access(props.precision) ?? CALENDAR_DEFAULTS.precision);

    const getWeekStartsOn = createMemo(() => access(props.weekStartsOn) ?? CALENDAR_DEFAULTS.weekStartsOn);

    const getMonth = createMemo(() => monthSignal[0]());

    const getPageStart = createMemo(() => CalendarUtils.getPageStart(getMonth(), getPrecision()));

    const getToday = createMemo(() => CalendarUtils.resolveToday(access(props.today), getMonth()));

    const getCells = createMemo(() => CalendarUtils.getCells(getMonth(), getPrecision(), getWeekStartsOn()));

    const getShape = createMemo(() => CalendarUtils.getGridShape(getMonth(), getPrecision()));

    const getRows = createMemo(() => CalendarUtils.getRows(getCells(), getShape().colCount));

    const getCurrentEraId = createMemo(() => CalendarUtils.getCurrentEraId(getMonth(), access(props.locale)));

    const getFirstCell = createMemo(() => getCells()[0]);

    const getCellLabeler = createMemo(() =>
        CalendarUtils.createCellLabeler(getFirstCell(), getPrecision(), getCurrentEraId(), access(props.locale)),
    );

    const computePageLabel = () =>
        CalendarUtils.formatPage(getPageStart(), getCells(), getPrecision(), getCurrentEraId(), access(props.locale));

    const getWeekdayNames = createMemo(() =>
        DateValueUtils.getWeekdayNames(
            getWeekStartsOn(),
            access(props.weekdayWidth) ?? CALENDAR_DEFAULTS.weekdayWidth,
            access(props.locale),
        ),
    );

    const getIsDayDisabled = (day: DateValue) =>
        CalendarUtils.getIsCellDisabled(day, getPrecision(), {
            isDisabled: access(props.isDisabled),
            minValue: access(props.minValue),
            maxValue: access(props.maxValue),
            computeIsDayDisabled: props.computeIsDayDisabled,
        });

    const getRovingDay = createMemo(() =>
        CalendarUtils.computeRovingDay(getCells(), getPrecision(), {
            highlighted: getHighlighted(),
            anchor: props.computeAnchorDay?.(),
            today: getToday(),
            pageStart: getPageStart(),
        }),
    );

    const moveTo = (day: DateValue) => {
        const move = CalendarUtils.computeMove(
            day,
            getPrecision(),
            getPageStart(),
            access(props.minValue),
            access(props.maxValue),
        );

        setHighlighted(() => move.day);

        if (move.month) monthSignal[1](() => move.month!);
    };

    const pickDay = (day: DateValue) => {
        if (getIsDayDisabled(day)) return;

        const picked = CalendarUtils.computePick(day, getPrecision(), access(props.minValue), access(props.maxValue));

        setHighlighted(() => picked);
        props.onPick(picked);
    };

    const getPaintedRange = createMemo(() => props.computeRange?.(getRovingDay()));

    createEffect(() => {
        const anchor = props.computeAnchorDay?.();

        if (!anchor) return;

        setHighlighted(() => anchor);
    });

    createEffect<DateValue | undefined>((previous) => {
        const pageStart = getPageStart();

        if (previous && !DateValueUtils.isSame(previous, pageStart)) LiveAnnouncerUtils.announce(computePageLabel());

        return pageStart;
    });

    createEffect(() => {
        const cell = getCells()[CalendarUtils.findCellIndex(getCells(), getRovingDay(), getPrecision()) ?? -1];
        const root = getRootRef();

        if (!cell || !root?.contains(document.activeElement) || root === document.activeElement) return;

        document.getElementById(`${gridId}-day-${DateValueUtils.toIso(cell)}`)?.focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        const action = CalendarUtils.computeKeyAction(e.key, e.shiftKey, {
            roving: getRovingDay(),
            precision: getPrecision(),
            cells: getCells(),
            shape: getShape(),
            direction: getDirection(),
        });

        if (!action) return;

        e.preventDefault();

        if (action.kind === "pick") pickDay(action.day);
        else moveTo(action.day);
    };

    return (
        <div
            ref={setRootRef}
            id={gridId}
            class={styles.calendarRoot}
            style={{
                "grid-template-columns": `repeat(${getShape().colCount}, 1fr)`,
                "gap": `${access(props.gap) ?? CALENDAR_DEFAULTS.gap}px`,
            }}
            role="grid"
            aria-label={access(props.ariaLabel)}
            aria-disabled={access(props.isDisabled) || undefined}
            onKeyDown={handleKeyDown}
        >
            <Show when={getPrecision() === "day"}>
                <div class={styles.calendarRow} style={{ "grid-column": `span ${getShape().colCount}` }} role="row">
                    <Index each={getWeekdayNames()}>
                        {(getName, index) => (
                            <div class={styles.calendarWeekday} role="columnheader" aria-label={getName()}>
                                {props.renderWeekday?.(getName(), index)}
                            </div>
                        )}
                    </Index>
                </div>
            </Show>

            <Index each={getRows()}>
                {(getRow) => (
                    <div class={styles.calendarRow} style={{ "grid-column": `span ${getShape().colCount}` }} role="row">
                        <Index each={getRow()}>
                            {(getDay) => (
                                <InteractionWrapper
                                    sizing={"fill"}
                                    isDisabled={() => getIsDayDisabled(getDay())}
                                    isFocusableWhenDisabled={() => !(access(props.isDisabled) ?? false)}
                                    isTabbable={() =>
                                        CalendarUtils.getIsSameCell(getDay(), getRovingDay(), getPrecision())
                                    }
                                    extraFlags={(): CalendarRenderProps =>
                                        CalendarUtils.computeCellFlags(getDay(), {
                                            precision: getPrecision(),
                                            month: getMonth(),
                                            roving: getRovingDay(),
                                            today: getToday(),
                                            isSelected: props.computeIsSelected(getDay()),
                                            range: getPaintedRange(),
                                        })
                                    }
                                    renderControl={(setElementRef, getRenderProps) => (
                                        <CalendarDay
                                            ref={setElementRef}
                                            id={() => `${gridId}-day-${DateValueUtils.toIso(getDay())}`}
                                            flags={getRenderProps}
                                            ariaLabel={() => getCellLabeler()(getDay())}
                                            renderContent={(getDayFlags) => props.renderDay(getDay, getDayFlags)}
                                            onSelect={() => pickDay(getDay())}
                                        />
                                    )}
                                />
                            )}
                        </Index>
                    </div>
                )}
            </Index>
        </div>
    );
};

export const Calendar = (props: CalendarProps) => {
    const valueSignal = accessSignal(() => props.value);

    const getPrecision = () => access(props.precision) ?? CALENDAR_DEFAULTS.precision;

    return (
        <CalendarComposite
            {...props}
            computeIsSelected={(day) => CalendarUtils.getIsSameCell(day, valueSignal[0](), getPrecision())}
            computeAnchorDay={() => valueSignal[0]()}
            onPick={(day) => valueSignal[1](() => day)}
        />
    );
};
