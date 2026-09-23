import { getLocalTimeZone } from "@internationalized/date";

import type { DateValue, DateValueWeekStart } from "../../../Abstracts/DateValue/DateValue.types";
import { DateValueUtils } from "../../../Abstracts/DateValue/DateValue.utils";
import type { NavigatorGrid } from "../../../Abstracts/Navigator/Navigator.types";
import type { CalendarPrecision } from "./Calendar.types";

/** Days in a week, which is the width of the day grid. */
const DAYS_PER_WEEK = 7;
/** Rows in the day grid, enough for any month in any supported calendar. */
const GRID_WEEKS = 6;
/** Columns in the month and year grids. */
const WIDE_CELL_COLUMNS = 3;
/** Years on one page of the year grid. */
const YEARS_PER_PAGE = 12;
/** How many pages one long step covers above `day` precision. */
const PAGES_PER_LEAP = 12;
/** Pushes a date to noon before handing it to `Intl`, so a time-zone shift cannot move it onto another day. */
const MIDDAY_MS = 12 * 60 * 60 * 1000;

/** The first day of a date's year. */
const getStartOfYear = (value: DateValue) => DateValueUtils.getStartOfMonth(value).set({ month: 1 }) as DateValue;

/** A `Date` at noon on the given day, safe to hand to `Intl.DateTimeFormat`. */
const toIntlDate = (value: DateValue) => new Date(DateValueUtils.toDate(value).getTime() + MIDDAY_MS);

/**
 * The arithmetic behind a calendar grid at each precision: which dates a page holds, what one cell covers, and
 * how the page is shaped and stepped.
 *
 * A page is what the grid shows at once — a month of days, a year of months, or twelve years. A cell is one
 * pickable unit on it, named by its first day, so a month cell is the first of that month and a year cell the
 * first day of that year. Everything here works in the calendar the given date carries.
 */
export namespace CalendarUtils {
    /**
     * The first day of the page a date falls on.
     *
     * @param value Any date on the page.
     * @param precision What one cell holds.
     * @returns The first of the month for `day`, the first day of the year for `month`, and for `year` the
     * first day of the first year of its twelve — pages run from year 1 of the era in twelves, so 2017 to 2028
     * is one page.
     */
    export const getPageStart = (value: DateValue, precision: CalendarPrecision): DateValue => {
        if (precision === "day") return DateValueUtils.getStartOfMonth(value);

        const yearStart = getStartOfYear(value);

        if (precision === "month") return yearStart;

        return yearStart.set({ year: value.year - ((value.year - 1) % YEARS_PER_PAGE) }) as DateValue;
    };

    /**
     * The first day of the cell a date falls in.
     *
     * @returns The date itself for `day`, the first of its month for `month`, the first day of its year for
     * `year`.
     */
    export const getCellStart = (value: DateValue, precision: CalendarPrecision): DateValue => {
        if (precision === "day") return value;
        if (precision === "month") return DateValueUtils.getStartOfMonth(value);

        return getStartOfYear(value);
    };

    /**
     * The last day of the cell a date falls in.
     *
     * @returns The date itself for `day`, the last of its month for `month`, the last day of its year for
     * `year`.
     */
    export const getCellEnd = (value: DateValue, precision: CalendarPrecision): DateValue => {
        const start = getCellStart(value, precision);

        if (precision === "day") return start;
        if (precision === "month") return DateValueUtils.addDays(DateValueUtils.addMonths(start, 1), -1);

        return DateValueUtils.addDays(DateValueUtils.addYears(start, 1), -1);
    };

    /**
     * Tests whether two dates fall in the same cell.
     *
     * @returns `false` when either is missing, so an unpicked value never matches a cell.
     */
    export const getIsSameCell = (a: DateValue | undefined, b: DateValue | undefined, precision: CalendarPrecision) =>
        a !== undefined &&
        b !== undefined &&
        DateValueUtils.isSame(getCellStart(a, precision), getCellStart(b, precision));

    /**
     * Tests whether any day of a cell lies between a minimum and a maximum, both included.
     *
     * A month is pickable while any of its days is, so bounds falling mid-month leave that month enabled; a
     * pick of it is then clamped into the bounds by the caller.
     *
     * @param min The earliest allowed day, if there is one.
     * @param max The latest allowed day, if there is one.
     */
    export const getIsCellInBounds = (
        value: DateValue,
        precision: CalendarPrecision,
        min?: DateValue,
        max?: DateValue,
    ) =>
        (!min || DateValueUtils.compare(getCellEnd(value, precision), min) >= 0) &&
        (!max || DateValueUtils.compare(getCellStart(value, precision), max) <= 0);

    /**
     * How many rows and columns the page is drawn in.
     *
     * @param page Any date on the page, which matters for `month`: a year with a thirteenth month gets a fifth
     * row.
     * @returns Six weeks of seven days for `day`; three columns of months for `month`; four rows of three years
     * for `year`.
     */
    export const getGridShape = (page: DateValue, precision: CalendarPrecision): NavigatorGrid => {
        if (precision === "day") return { rowCount: GRID_WEEKS, colCount: DAYS_PER_WEEK };
        if (precision === "month") {
            return {
                rowCount: Math.ceil(DateValueUtils.getMonthsInYear(page) / WIDE_CELL_COLUMNS),
                colCount: WIDE_CELL_COLUMNS,
            };
        }

        return { rowCount: YEARS_PER_PAGE / WIDE_CELL_COLUMNS, colCount: WIDE_CELL_COLUMNS };
    };

    /**
     * Every cell on the page, in reading order.
     *
     * @param page Any date on the page.
     * @param weekStartsOn Where the week starts, which only the day grid reads.
     * @returns Forty-two days for `day`, leading and trailing days of the neighboring months included; every
     * month of the year for `month`; twelve years for `year`. Each is the first day of its cell.
     */
    export const getCells = (
        page: DateValue,
        precision: CalendarPrecision,
        weekStartsOn: DateValueWeekStart,
    ): DateValue[] => {
        if (precision === "day") return DateValueUtils.getMonthGrid(page, weekStartsOn).weeks.flat();

        const start = getPageStart(page, precision);

        if (precision === "month") {
            return Array.from({ length: DateValueUtils.getMonthsInYear(page) }, (_, index) =>
                DateValueUtils.addMonths(start, index),
            );
        }

        return Array.from({ length: YEARS_PER_PAGE }, (_, index) => DateValueUtils.addYears(start, index));
    };

    /**
     * The cell a number of places on from the page's first cell, counting in reading order.
     *
     * The count may run off either end of the page, which is what lets a walk carry on into the neighboring page
     * rather than stopping at its edge.
     *
     * @param firstCell The page's first cell, as {@link CalendarUtils.getCells} answers it.
     * @param index How many cells on. Negative goes backwards.
     */
    export const getCellAt = (firstCell: DateValue, index: number, precision: CalendarPrecision): DateValue => {
        if (precision === "day") return DateValueUtils.addDays(firstCell, index);
        if (precision === "month") return DateValueUtils.addMonths(firstCell, index);

        return DateValueUtils.addYears(firstCell, index);
    };

    /**
     * A date moved by whole pages, which is what a calendar's previous and next buttons do.
     *
     * @param pages How many pages to move. Negative goes backwards.
     * @returns A month on per page for `day`, a year for `month`, twelve years for `year`. The day is clamped
     * to the month it lands in.
     */
    export const stepPage = (value: DateValue, precision: CalendarPrecision, pages: number): DateValue => {
        if (precision === "day") return DateValueUtils.addMonths(value, pages);
        if (precision === "month") return DateValueUtils.addYears(value, pages);

        return DateValueUtils.addYears(value, pages * YEARS_PER_PAGE);
    };

    /**
     * A date moved by a long step, which is what Shift with the page keys does.
     *
     * @param leaps How many long steps to move. Negative goes backwards.
     * @returns A year on per step for `day`, whatever the calendar's month count; twelve pages per step for
     * `month` and `year`. The day is clamped to the month it lands in.
     */
    export const stepLeap = (value: DateValue, precision: CalendarPrecision, leaps: number): DateValue =>
        precision === "day"
            ? DateValueUtils.addYears(value, leaps)
            : stepPage(value, precision, leaps * PAGES_PER_LEAP);

    /**
     * Writes the span between two dates through `Intl`, in the first date's calendar and the given locale.
     *
     * The separator and the order are the locale's, so a page of years reads as "2017–2028" in one language and
     * however another writes a span in its own.
     *
     * @param start The first date of the span.
     * @param end The last date of the span, in the same calendar.
     * @param options Anything `Intl.DateTimeFormat` accepts. The calendar and time zone are supplied.
     * @param locale The locale to write in. The platform's default is used when omitted.
     */
    export const formatSpan = (
        start: DateValue,
        end: DateValue,
        options: Intl.DateTimeFormatOptions,
        locale?: string,
    ) =>
        new Intl.DateTimeFormat(locale, {
            ...options,
            calendar: DateValueUtils.getCalendarId(start),
            timeZone: getLocalTimeZone(),
        }).formatRange(toIntlDate(start), toIntlDate(end));
}
