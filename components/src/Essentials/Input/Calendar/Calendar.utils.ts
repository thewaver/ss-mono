import { getLocalTimeZone } from "@internationalized/date";

import type { DateValue, DateValueRange, DateValueWeekStart } from "../../../Abstracts/DateValue/DateValue.types";
import { DateValueUtils } from "../../../Abstracts/DateValue/DateValue.utils";
import type { NavigatorDirection, NavigatorGrid } from "../../../Abstracts/Navigator/Navigator.types";
import { NavigatorUtils } from "../../../Abstracts/Navigator/Navigator.utils";
import type { CalendarKeyAction, CalendarPrecision, CalendarRenderProps } from "./Calendar.types";

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

/** How many pages the page keys move. */
const PAGE_STEP = 1;
/** How many long steps Shift with the page keys moves. */
const LEAP_STEP = 1;

/** How a cell names itself for assistive technology, at each precision. */
const CELL_LABEL_OPTIONS: Record<CalendarPrecision, Intl.DateTimeFormatOptions> = {
    day: { day: "numeric", month: "long", year: "numeric" },
    month: { month: "long", year: "numeric" },
    year: { year: "numeric" },
};
/** How a page is named when paging announces it, at each precision. */
const PAGE_ANNOUNCE_OPTIONS: Record<CalendarPrecision, Intl.DateTimeFormatOptions> = {
    day: { month: "long", year: "numeric" },
    month: { year: "numeric" },
    year: { year: "numeric" },
};

/** The same options with the era written out, for a date that is not in the current era. */
const withEra = (options: Intl.DateTimeFormatOptions): Intl.DateTimeFormatOptions => ({ ...options, era: "short" });

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

    /**
     * The page's cells cut into rows.
     *
     * @param cells Every cell on the page, as {@link CalendarUtils.getCells} answers them.
     * @param colCount How many cells a row holds.
     * @returns The rows in order. A last row with fewer cells than the others is kept short rather than padded.
     */
    export const getRows = (cells: DateValue[], colCount: number) =>
        Array.from({ length: Math.ceil(cells.length / colCount) }, (_, row) =>
            cells.slice(row * colCount, (row + 1) * colCount),
        );

    /**
     * Where on the page the cell holding a date sits.
     *
     * @param cells Every cell on the page.
     * @param value The date to look for.
     * @returns Its index in reading order, or `undefined` when the date is not on this page or is missing.
     */
    export const findCellIndex = (cells: DateValue[], value: DateValue | undefined, precision: CalendarPrecision) => {
        const index = cells.findIndex((cell) => getIsSameCell(cell, value, precision));

        return index < 0 ? undefined : index;
    };

    /**
     * Tests whether a cell can be picked.
     *
     * @param day The cell's first day.
     * @param opts.isDisabled Whether the whole calendar is off.
     * @param opts.minValue The earliest day that can be picked, if there is one.
     * @param opts.maxValue The latest day that can be picked, if there is one.
     * @param opts.computeIsDayDisabled The consumer's own rule, handed the cell's first day.
     * @returns `true` when the calendar is off, when no day of the cell is inside the bounds, or when the
     * consumer's rule refuses it.
     */
    export const getIsCellDisabled = (
        day: DateValue,
        precision: CalendarPrecision,
        opts: {
            isDisabled?: boolean;
            minValue?: DateValue;
            maxValue?: DateValue;
            computeIsDayDisabled?: (day: DateValue) => boolean;
        },
    ) =>
        (opts.isDisabled ?? false) ||
        !getIsCellInBounds(day, precision, opts.minValue, opts.maxValue) ||
        (opts.computeIsDayDisabled?.(day) ?? false);

    /**
     * The day counted as today, in the calendar the page is drawn in.
     *
     * @param today The consumer's own today, if they hold one still.
     * @param page Any date on the page, whose calendar the answer is expressed in.
     * @returns That day, or the machine's current date when none is given.
     */
    export const resolveToday = (today: DateValue | undefined, page: DateValue) =>
        DateValueUtils.withCalendar(today ?? DateValueUtils.fromDate(new Date()), DateValueUtils.getCalendarId(page));

    /**
     * The day the grid's one tab stop sits on.
     *
     * The first of the candidates that is on the page wins, so a walk the keyboard has made is kept while it is
     * visible, and paging with the header lands on the picked day, then today, then the page's first day.
     *
     * @param cells Every cell on the page.
     * @param candidates.highlighted Where the keyboard last left it.
     * @param candidates.anchor The picked day, or the end a range is being measured from.
     * @param candidates.today Today, from {@link CalendarUtils.resolveToday}.
     * @param candidates.pageStart The page's first day, which is always the last resort.
     */
    export const computeRovingDay = (
        cells: DateValue[],
        precision: CalendarPrecision,
        candidates: {
            highlighted?: DateValue;
            anchor?: DateValue;
            today: DateValue;
            pageStart: DateValue;
        },
    ) => {
        const isOnPage = (day: DateValue | undefined): day is DateValue =>
            day !== undefined && findCellIndex(cells, day, precision) !== undefined;

        if (isOnPage(candidates.highlighted)) return candidates.highlighted;
        if (isOnPage(candidates.anchor)) return candidates.anchor;
        if (isOnPage(candidates.today)) return candidates.today;

        return candidates.pageStart;
    };

    /**
     * Where a move of the keyboard's highlight lands, and whether it takes the page with it.
     *
     * @param day Where the move was aimed.
     * @param pageStart The first day of the page now shown.
     * @param minValue The earliest day allowed, if there is one.
     * @param maxValue The latest day allowed, if there is one.
     * @returns `day`, the aim pulled inside the bounds; and `month`, the first of the month to show when that day
     * is on another page, or `undefined` when the page stays.
     */
    export const computeMove = (
        day: DateValue,
        precision: CalendarPrecision,
        pageStart: DateValue,
        minValue?: DateValue,
        maxValue?: DateValue,
    ) => {
        const clamped = DateValueUtils.clamp(day, minValue, maxValue);
        const isSamePage = DateValueUtils.isSame(getPageStart(clamped, precision), pageStart);

        return { day: clamped, month: isSamePage ? undefined : DateValueUtils.getStartOfMonth(clamped) };
    };

    /**
     * The date a pick of a cell sets.
     *
     * @returns The cell's first day, pulled inside the bounds, so a month straddling the minimum picks the minimum.
     */
    export const computePick = (
        day: DateValue,
        precision: CalendarPrecision,
        minValue?: DateValue,
        maxValue?: DateValue,
    ) => DateValueUtils.clamp(getCellStart(day, precision), minValue, maxValue);

    /**
     * What a key pressed on the grid does.
     *
     * Enter and Space pick the roving day. The page keys move it a page, and a long step with Shift held. The
     * arrows, Home and End walk the grid through `NavigatorUtils.computeNextCell`, carrying off either end of the
     * page into the next one; Home and End on a short last row stop at its last cell.
     *
     * @param key The `key` of the keyboard event.
     * @param isShiftHeld Whether Shift was held.
     * @param opts.roving The day the tab stop is on.
     * @param opts.cells Every cell on the page.
     * @param opts.shape The page's shape, from {@link CalendarUtils.getGridShape}.
     * @param opts.direction Which way the grid's text runs. Under `rtl` the horizontal arrows trade places.
     * @returns What to do, or `undefined` when the key is not the grid's.
     */
    export const computeKeyAction = (
        key: string,
        isShiftHeld: boolean,
        opts: {
            roving: DateValue;
            precision: CalendarPrecision;
            cells: DateValue[];
            shape: NavigatorGrid;
            direction: NavigatorDirection;
        },
    ): CalendarKeyAction | undefined => {
        const { roving, precision, cells, shape } = opts;

        if (NavigatorUtils.getIsActivationKey(key)) return { kind: "pick", day: roving };

        if (key === "PageUp" || key === "PageDown") {
            const direction = key === "PageUp" ? -1 : 1;

            return {
                kind: "move",
                day: isShiftHeld
                    ? stepLeap(roving, precision, direction * LEAP_STEP)
                    : stepPage(roving, precision, direction * PAGE_STEP),
            };
        }

        const index = findCellIndex(cells, roving, precision);

        if (index === undefined) return undefined;

        const from = { row: Math.floor(index / shape.colCount), col: index % shape.colCount };
        const next = NavigatorUtils.computeNextCell(key, from, shape, {
            direction: opts.direction,
            hasPageKeys: false,
        });

        if (!next) return undefined;

        const flat = next.row * shape.colCount + next.col;
        const lastIndex = cells.length - 1;

        return {
            kind: "move",
            day: getCellAt(cells[0], next.row === from.row ? Math.min(flat, lastIndex) : flat, precision),
        };
    };

    /**
     * The state a cell is painted from.
     *
     * @param day The cell's first day.
     * @param opts.month Any date on the page, whose month decides which days are outside it.
     * @param opts.roving The day the tab stop is on.
     * @param opts.today Today.
     * @param opts.isSelected Whether the cell counts as picked.
     * @param opts.range The range to band, if there is one.
     */
    export const computeCellFlags = (
        day: DateValue,
        opts: {
            precision: CalendarPrecision;
            month: DateValue;
            roving: DateValue;
            today: DateValue;
            isSelected: boolean;
            range: DateValueRange | undefined;
        },
    ): CalendarRenderProps => ({
        day,
        isSelected: opts.isSelected,
        isToday: getIsSameCell(day, opts.today, opts.precision),
        isOutsideMonth: opts.precision === "day" && day.month !== opts.month.month,
        isHighlighted: getIsSameCell(day, opts.roving, opts.precision),
        isInRange: DateValueUtils.getIsWithin(day, opts.range),
        isRangeStart: DateValueUtils.isSame(day, opts.range?.start),
        isRangeEnd: DateValueUtils.isSame(day, opts.range?.end),
    });

    /**
     * The id of the era a page's calendar is in now, against which a cell or page decides whether to name its era.
     *
     * @param page Any date on the page.
     * @param locale The locale the era names are read in.
     * @returns The latest era the calendar reports.
     */
    export const getCurrentEraId = (page: DateValue, locale?: string) => {
        const eras = DateValueUtils.getEras(page, locale);

        return eras[eras.length - 1].id;
    };

    /**
     * A function naming a cell for assistive technology, since the painter often draws only a number.
     *
     * The formatters are built once, so a page of forty-two days pays for two rather than forty-two. A cell in a
     * past era is named with its era, so a year before the common era is not read as one after it.
     *
     * @param firstCell The page's first cell, whose calendar the names are written in.
     * @param currentEraId What {@link CalendarUtils.getCurrentEraId} answered.
     * @param locale The locale to write in.
     * @returns A function answering a cell's name: the whole date for `day`, month and year for `month`, the year
     * for `year`.
     */
    export const createCellLabeler = (
        firstCell: DateValue,
        precision: CalendarPrecision,
        currentEraId: string,
        locale?: string,
    ) => {
        const options = CELL_LABEL_OPTIONS[precision];
        const currentEra = DateValueUtils.createFormatter(firstCell, options, locale);
        const pastEra = DateValueUtils.createFormatter(firstCell, withEra(options), locale);

        return (cell: DateValue) => (cell.era === currentEraId ? currentEra : pastEra)(cell);
    };

    /**
     * What paging announces about the page it landed on.
     *
     * @param pageStart The page's first day.
     * @param cells Every cell on the page, whose ends name a page of years.
     * @param currentEraId What {@link CalendarUtils.getCurrentEraId} answered.
     * @param locale The locale to write in.
     * @returns The month and year for `day`, the year for `month`, and the span of years for `year` — with the era
     * written out when the page is in a past era.
     */
    export const formatPage = (
        pageStart: DateValue,
        cells: DateValue[],
        precision: CalendarPrecision,
        currentEraId: string,
        locale?: string,
    ) => {
        const baseOptions = PAGE_ANNOUNCE_OPTIONS[precision];
        const options = pageStart.era === currentEraId ? baseOptions : withEra(baseOptions);

        if (precision !== "year") return DateValueUtils.format(pageStart, options, locale);

        return formatSpan(cells[0], cells[cells.length - 1], options, locale);
    };
}
