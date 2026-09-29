import { type KeyboardEvent, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
    CALENDAR_DEFAULTS,
    type CalendarRenderProps,
    CalendarStyles,
    CalendarUtils,
    type DateValue,
    DateValueUtils,
    LiveAnnouncerUtils,
} from "@thewaver/ss-components";

import { NavigatorReactUtils } from "../../../Abstracts/Navigator/NavigatorReact.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import type { CalendarCompositeProps, CalendarDayProps, CalendarProps } from "./Calendar.types";

const toCellId = (gridId: string, day: DateValue) => `${gridId}-day-${DateValueUtils.toIso(day)}`;

const CalendarDay = (props: CalendarDayProps) => {
    const isDisabled = props.flags.isDisabled ?? false;

    return (
        <div
            id={props.id}
            ref={props.ref}
            className={CalendarStyles.calendarDay}
            role="gridcell"
            aria-label={props.ariaLabel}
            aria-selected={props.flags.isSelected}
            aria-current={props.flags.isToday ? "date" : undefined}
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

export const CalendarComposite = (props: CalendarCompositeProps) => {
    const [month, setMonth] = props.month;

    const gridId = useId();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const previousPageStartRef = useRef<DateValue | undefined>(undefined);
    const [highlighted, setHighlighted] = useState<DateValue>();

    const direction = NavigatorReactUtils.useDirection(rootRef);

    const precision = props.precision ?? CALENDAR_DEFAULTS.precision;
    const weekStartsOn = props.weekStartsOn ?? CALENDAR_DEFAULTS.weekStartsOn;
    const weekdayWidth = props.weekdayWidth ?? CALENDAR_DEFAULTS.weekdayWidth;

    const pageStart = useMemo(() => CalendarUtils.getPageStart(month, precision), [month, precision]);
    const today = useMemo(() => CalendarUtils.resolveToday(props.today, month), [props.today, month]);
    const cells = useMemo(
        () => CalendarUtils.getCells(month, precision, weekStartsOn),
        [month, precision, weekStartsOn],
    );
    const shape = CalendarUtils.getGridShape(month, precision);
    const rows = CalendarUtils.getRows(cells, shape.colCount);
    const currentEraId = useMemo(() => CalendarUtils.getCurrentEraId(month, props.locale), [month, props.locale]);

    const labelCell = useMemo(
        () => CalendarUtils.createCellLabeler(cells[0], precision, currentEraId, props.locale),
        [cells, precision, currentEraId, props.locale],
    );

    const weekdayNames = useMemo(
        () => DateValueUtils.getWeekdayNames(weekStartsOn, weekdayWidth, props.locale),
        [weekStartsOn, weekdayWidth, props.locale],
    );

    const rovingDay = CalendarUtils.computeRovingDay(cells, precision, {
        highlighted,
        anchor: props.anchorDay,
        today,
        pageStart,
    });

    const paintedRange = props.computeRange?.(rovingDay);

    const getIsDayDisabled = (day: DateValue) =>
        CalendarUtils.getIsCellDisabled(day, precision, {
            isDisabled: props.isDisabled,
            minValue: props.minValue,
            maxValue: props.maxValue,
            computeIsDayDisabled: props.computeIsDayDisabled,
        });

    const moveTo = (day: DateValue) => {
        const move = CalendarUtils.computeMove(day, precision, pageStart, props.minValue, props.maxValue);

        setHighlighted(move.day);

        if (move.month) setMonth(move.month);
    };

    const pickDay = (day: DateValue) => {
        if (getIsDayDisabled(day)) return;

        const picked = CalendarUtils.computePick(day, precision, props.minValue, props.maxValue);

        setHighlighted(picked);
        props.onPick(picked);
    };

    useEffect(() => LiveAnnouncerUtils.reserve("polite"), []);

    useEffect(() => {
        if (props.anchorDay) setHighlighted(props.anchorDay);
    }, [props.anchorDay]);

    useEffect(() => {
        const previous = previousPageStartRef.current;

        previousPageStartRef.current = pageStart;

        if (!previous || DateValueUtils.isSame(previous, pageStart)) return;

        LiveAnnouncerUtils.announce(CalendarUtils.formatPage(pageStart, cells, precision, currentEraId, props.locale));
    }, [pageStart]);

    const rovingIndex = CalendarUtils.findCellIndex(cells, rovingDay, precision);
    const rovingCell = rovingIndex === undefined ? undefined : cells[rovingIndex];
    const rovingCellId = rovingCell && toCellId(gridId, rovingCell);

    useLayoutEffect(() => {
        const root = rootRef.current;

        if (!rovingCellId || !root?.contains(document.activeElement) || root === document.activeElement) return;

        document.getElementById(rovingCellId)?.focus();
    }, [rovingCellId]);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const action = CalendarUtils.computeKeyAction(e.key, e.shiftKey, {
            roving: rovingDay,
            precision,
            cells,
            shape,
            direction,
        });

        if (!action) return;

        e.preventDefault();

        if (action.kind === "pick") pickDay(action.day);
        else moveTo(action.day);
    };

    const rowStyle = { gridColumn: `span ${shape.colCount}` };

    return (
        <div
            ref={rootRef}
            id={gridId}
            className={CalendarStyles.calendarRoot}
            style={{
                gridTemplateColumns: `repeat(${shape.colCount}, 1fr)`,
                gap: `${props.gap ?? CALENDAR_DEFAULTS.gap}px`,
            }}
            role="grid"
            aria-label={props.ariaLabel}
            aria-disabled={props.isDisabled || undefined}
            onKeyDown={handleKeyDown}
        >
            {precision === "day" && (
                <div className={CalendarStyles.calendarRow} style={rowStyle} role="row">
                    {weekdayNames.map((name, index) => (
                        <div
                            key={index}
                            className={CalendarStyles.calendarWeekday}
                            role="columnheader"
                            aria-label={name}
                        >
                            {props.renderWeekday?.(name, index)}
                        </div>
                    ))}
                </div>
            )}

            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className={CalendarStyles.calendarRow} style={rowStyle} role="row">
                    {row.map((day, colIndex) => (
                        <InteractionWrapper<CalendarRenderProps>
                            key={colIndex}
                            sizing={"fill"}
                            isDisabled={getIsDayDisabled(day)}
                            isFocusableWhenDisabled={!(props.isDisabled ?? false)}
                            isTabbable={CalendarUtils.getIsSameCell(day, rovingDay, precision)}
                            extraFlags={CalendarUtils.computeCellFlags(day, {
                                precision,
                                month,
                                roving: rovingDay,
                                today,
                                isSelected: props.computeIsSelected(day),
                                range: paintedRange,
                            })}
                            renderControl={(setElementRef, flags) => (
                                <CalendarDay
                                    ref={setElementRef}
                                    id={toCellId(gridId, day)}
                                    flags={flags}
                                    ariaLabel={labelCell(day)}
                                    renderContent={(dayFlags) => props.renderDay(day, dayFlags)}
                                    onSelect={() => pickDay(day)}
                                />
                            )}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export const Calendar = (props: CalendarProps) => {
    const [value, setValue] = props.value;

    const precision = props.precision ?? CALENDAR_DEFAULTS.precision;

    return (
        <CalendarComposite
            {...props}
            computeIsSelected={(day) => CalendarUtils.getIsSameCell(day, value, precision)}
            anchorDay={value}
            onPick={setValue}
        />
    );
};
