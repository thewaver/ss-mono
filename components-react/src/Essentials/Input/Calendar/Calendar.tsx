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

type CalendarPage = { start: DateValue; cells: DateValue[] };

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
    const minDaysInFirstWeek = props.minDaysInFirstWeek ?? CALENDAR_DEFAULTS.minDaysInFirstWeek;
    const monthCount = precision === "day" ? (props.monthCount ?? CALENDAR_DEFAULTS.monthCount) : 1;
    const isMultiMonth = monthCount > 1;

    useEffect(() => CalendarUtils.warnIfMonthCountIgnored(props.precision, props.monthCount), []);

    const pageStart = useMemo(() => CalendarUtils.getPageStart(month, precision), [month, precision]);
    const today = useMemo(() => CalendarUtils.resolveToday(props.today, month), [props.today, month]);
    const pages = useMemo<CalendarPage[]>(
        () =>
            monthCount === 1
                ? [{ start: pageStart, cells: CalendarUtils.getCells(month, precision, weekStartsOn) }]
                : CalendarUtils.getMonthStarts(month, monthCount).map((start) => ({
                      start,
                      cells: CalendarUtils.getCells(start, precision, weekStartsOn),
                  })),
        [month, precision, weekStartsOn, monthCount, pageStart],
    );
    const cells = useMemo(
        () =>
            isMultiMonth ? pages.flatMap((page) => CalendarUtils.getOwnDays(page.cells, page.start)) : pages[0].cells,
        [pages, isMultiMonth],
    );
    const shape = CalendarUtils.getGridShape(month, precision);
    const hasWeekNumbers = precision === "day" && props.renderWeekNumber !== undefined;
    const columnCount = shape.colCount + (hasWeekNumbers ? 1 : 0);
    const currentEraId = useMemo(() => CalendarUtils.getCurrentEraId(month, props.locale), [month, props.locale]);

    const weekFieldName = useMemo(
        () => (hasWeekNumbers ? CalendarUtils.getWeekFieldName(props.locale) : ""),
        [hasWeekNumbers, props.locale],
    );

    const labelCell = useMemo(
        () => CalendarUtils.createCellLabeler(pages[0].cells[0], precision, currentEraId, props.locale),
        [pages, precision, currentEraId, props.locale],
    );

    const computeMonthLabel = (page: CalendarPage) =>
        CalendarUtils.formatPage(page.start, page.cells, precision, currentEraId, props.locale);

    const computePageLabel = () =>
        isMultiMonth
            ? CalendarUtils.formatMonthSpan(pages[0].start, pages[pages.length - 1].start, currentEraId, props.locale)
            : computeMonthLabel(pages[0]);

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
            disabledDays: props.disabledDays,
            computeIsDayDisabled: props.computeIsDayDisabled,
        });

    const moveTo = (day: DateValue) => {
        const move = CalendarUtils.computeMove(day, precision, pageStart, props.minValue, props.maxValue, monthCount);

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

        LiveAnnouncerUtils.announce(computePageLabel());
    }, [pageStart]);

    const rovingIndex = CalendarUtils.findCellIndex(cells, rovingDay, precision);
    const rovingCell = rovingIndex === undefined ? undefined : cells[rovingIndex];
    const rovingCellId = rovingCell && toCellId(gridId, rovingCell);

    useLayoutEffect(() => {
        const root = rootRef.current;

        if (!rovingCellId || !root?.contains(document.activeElement) || root === document.activeElement) return;

        document.getElementById(rovingCellId)?.focus();
    }, [rovingCellId]);

    const rovingPage = pages.find((page) => CalendarUtils.getIsSameCell(page.start, rovingDay, "month")) ?? pages[0];

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const action = CalendarUtils.computeKeyAction(e.key, e.shiftKey, {
            roving: rovingDay,
            precision,
            cells: isMultiMonth ? rovingPage.cells : cells,
            shape,
            direction,
            monthCount,
        });

        if (!action) return;

        e.preventDefault();

        if (action.kind === "pick") pickDay(action.day);
        else moveTo(action.day);
    };

    const rowStyle = { gridColumn: `span ${columnCount}` };

    const gridStyle = {
        gridTemplateColumns: hasWeekNumbers ? `auto repeat(${shape.colCount}, 1fr)` : `repeat(${shape.colCount}, 1fr)`,
        gap: `${props.gap ?? CALENDAR_DEFAULTS.gap}px`,
    };

    const renderDay = (page: CalendarPage, day: DateValue, key: number) =>
        !isMultiMonth || CalendarUtils.getIsSameCell(page.start, day, "month") ? (
            <InteractionWrapper<CalendarRenderProps>
                key={key}
                sizing={"fill"}
                isDisabled={getIsDayDisabled(day)}
                isFocusableWhenDisabled={!(props.isDisabled ?? false)}
                isTabbable={CalendarUtils.getIsSameCell(day, rovingDay, precision)}
                extraFlags={CalendarUtils.computeCellFlags(day, {
                    precision,
                    month: page.start,
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
        ) : (
            <div key={key} role="gridcell" />
        );

    const renderWeekNumber = (row: DateValue[]) => {
        const weekNumber = DateValueUtils.getWeekNumber(row[0], weekStartsOn, minDaysInFirstWeek);

        return (
            <div
                className={CalendarStyles.calendarWeekNumber}
                role="rowheader"
                aria-label={CalendarUtils.formatWeekLabel(weekFieldName, weekNumber)}
            >
                {props.renderWeekNumber?.(weekNumber)}
            </div>
        );
    };

    const renderRows = (page: CalendarPage) => (
        <>
            {precision === "day" && (
                <div className={CalendarStyles.calendarRow} style={rowStyle} role="row">
                    {hasWeekNumbers && (
                        <div
                            className={CalendarStyles.calendarWeekNumber}
                            role="columnheader"
                            aria-label={weekFieldName}
                        />
                    )}

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

            {CalendarUtils.getRows(page.cells, shape.colCount).map((row, rowIndex) => (
                <div key={rowIndex} className={CalendarStyles.calendarRow} style={rowStyle} role="row">
                    {hasWeekNumbers && renderWeekNumber(row)}

                    {row.map((day, colIndex) => renderDay(page, day, colIndex))}
                </div>
            ))}
        </>
    );

    if (!isMultiMonth) {
        return (
            <div
                ref={rootRef}
                id={gridId}
                className={CalendarStyles.calendarRoot}
                style={gridStyle}
                role="grid"
                aria-label={props.ariaLabel}
                aria-disabled={props.isDisabled || undefined}
                onKeyDown={handleKeyDown}
            >
                {renderRows(pages[0])}
            </div>
        );
    }

    return (
        <div
            ref={rootRef}
            id={gridId}
            className={CalendarStyles.calendarMonths}
            style={{ gap: `${props.monthGap ?? CALENDAR_DEFAULTS.monthGap}px` }}
            role="group"
            aria-label={props.ariaLabel}
            aria-disabled={props.isDisabled || undefined}
            onKeyDown={handleKeyDown}
        >
            {pages.map((page, index) => (
                <div key={index} className={CalendarStyles.calendarMonth}>
                    {props.renderMonthHeader?.(page.start, index)}

                    <div
                        className={CalendarStyles.calendarRoot}
                        style={gridStyle}
                        role="grid"
                        aria-label={computeMonthLabel(page)}
                    >
                        {renderRows(page)}
                    </div>
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
