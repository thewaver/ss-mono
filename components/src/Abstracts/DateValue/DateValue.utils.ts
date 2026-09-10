import {
    CalendarDate,
    createCalendar,
    getLocalTimeZone,
    isSameDay,
    startOfMonth,
    toCalendar,
    toCalendarDate,
    fromDate as toDateValue,
} from "@internationalized/date";

import type {
    DateValue,
    DateValueCalendarId,
    DateValueEra,
    DateValueMonthGrid,
    DateValueParts,
    DateValueRange,
    DateValueWeekStart,
    DateValueWeekdayWidth,
} from "./DateValue.types";

/** Days in a week, in every calendar this supports. */
const DAYS_PER_WEEK = 7;
/** Rows in a month grid. Six is enough for any month in any supported calendar, so the grid never changes height as the user pages through it. */
const GRID_WEEKS = 6;
/** Pushes a date to noon before handing it to `Intl`, so a time-zone shift of a few hours cannot move it onto the day before or after. */
const MIDDAY_MS = 12 * 60 * 60 * 1000;
/** The calendar used when a caller does not name one. */
const DEFAULT_CALENDAR_ID: DateValueCalendarId = "gregory";
/** `YYYY-MM-DD`, with the expanded `±YYYYYY` form for years outside four digits. */
const ISO_PATTERN = /^(\d{4}|[+-]\d{6})-(\d{2})-(\d{2})$/;

/** Every calendar this supports, in the order a picker should offer them. */
const CALENDAR_IDS: DateValueCalendarId[] = [
    "gregory",
    "buddhist",
    "coptic",
    "ethiopic",
    "ethioaa",
    "hebrew",
    "indian",
    "islamic-civil",
    "islamic-tbla",
    "islamic-umalqura",
    "japanese",
    "persian",
    "roc",
];

/** Era names by calendar and locale. Building them costs several `Intl` formatters. */
const eraCache = new Map<string, DateValueEra[]>();
/** Month names by calendar, locale, era and year — all four matter, since month names and month counts vary by year in lunar calendars. */
const monthNameCache = new Map<string, string[]>();

/** The calendar implementation behind an identifier. */
const getCalendarOf = (id: DateValueCalendarId) => createCalendar(id);

/** A `Date` at noon on the given day, safe to hand to `Intl.DateTimeFormat`. */
const toIntlDate = (value: DateValue) => new Date(value.toDate(getLocalTimeZone()).getTime() + MIDDAY_MS);

/** Builds a Gregorian date from a year that may be zero or negative, mapping those onto the BC era. */
const fromAstronomicalYear = (year: number, month: number, day: number) =>
    year > 0 ? new CalendarDate(year, month, day) : new CalendarDate("BC", 1 - year, month, day);

/** The first day of an era, used as a base to graft another date's fields onto. */
const getEraStart = (id: DateValueCalendarId, era: string) => new CalendarDate(getCalendarOf(id), era, 1, 1, 1);

/** A date inside an era that is safely past its first day, for asking `Intl` what the era is called. */
const getEraSample = (id: DateValueCalendarId, era: string) => getEraStart(id, era).set({ year: 2 });

/**
 * Calendar arithmetic, month grids and localised names for a date without a time.
 *
 * A thin layer over `@internationalized/date`, which does the calendar mathematics; what is added
 * here is the shape a date picker actually needs — a six-week grid, the cell a date sits in, era
 * and month names, and round trips through plain parts and ISO text. Values are immutable: every
 * operation returns a new date.
 *
 * Non-Gregorian calendars are first-class rather than an afterthought, which is why so much of
 * this asks the calendar rather than assuming: how many months a year has, how many days a month
 * has, what the eras are called. All formatting goes through `Intl` in the local time zone.
 */
export namespace DateValueUtils {
    /**
     * Every calendar this supports.
     *
     * @returns A fresh array, so a caller may sort or filter it without affecting anyone else.
     */
    export const getCalendarIds = () => [...CALENDAR_IDS];

    /** Which calendar a date is expressed in. */
    export const getCalendarId = (value: DateValue) => value.calendar.identifier as DateValueCalendarId;

    /**
     * Re-expresses the same day in another calendar.
     *
     * The day itself does not move — only the year, month and day numbers used to name it change.
     *
     * @param value The date to convert.
     * @param id The calendar to express it in.
     */
    export const withCalendar = (value: DateValue, id: DateValueCalendarId) =>
        toCalendar(value, getCalendarOf(id)) as DateValue;

    /**
     * Tests whether two dates are the same day.
     *
     * Dates in different calendars compare correctly, since the comparison is on the day rather than
     * on the fields. Two missing dates count as the same.
     */
    export const isSame = (a: DateValue | undefined, b: DateValue | undefined) =>
        a === undefined || b === undefined ? a === b : isSameDay(a, b);

    /**
     * Orders two dates.
     *
     * @returns A negative number when `a` is earlier, `0` for the same day, a positive number when `a`
     * is later.
     */
    export const compare = (a: DateValue, b: DateValue) => a.compare(b);

    /**
     * Takes the calendar day a `Date` falls on in the local time zone.
     *
     * @param date The instant to read.
     * @param id The calendar to express the result in.
     */
    export const fromDate = (date: Date, id: DateValueCalendarId = DEFAULT_CALENDAR_ID) =>
        withCalendar(toCalendarDate(toDateValue(date, getLocalTimeZone())), id);

    /**
     * Converts a date to the instant its day begins at, in the local time zone.
     *
     * @returns Midnight local time.
     */
    export const toDate = (value: DateValue) => value.toDate(getLocalTimeZone());

    /**
     * The eras of a date's calendar, named in the given locale.
     *
     * Most calendars have one or two eras and the Japanese calendar has many, so an era picker cannot
     * hardcode them. Both a long and a short name are given because a wide select can afford "Before
     * Christ" where a compact field wants "BC".
     *
     * @param value Any date in the calendar being asked about.
     * @param locale The locale to name them in. The platform's default is used when omitted.
     * @returns One entry per era, oldest first, each carrying the identifier the other functions here
     * take. Cached, so repeat calls are free. An era whose name `Intl` will not give up falls back to
     * its own identifier.
     */
    export const getEras = (value: DateValue, locale?: string): DateValueEra[] => {
        const id = getCalendarId(value);
        const key = `${id}:${locale ?? ""}`;
        const cached = eraCache.get(key);

        if (cached) return cached;

        const ids = getCalendarOf(id).getEras();
        const readEra = (width: "long" | "short", at: Date) =>
            new Intl.DateTimeFormat(locale, {
                era: width,
                year: "numeric",
                calendar: id,
                timeZone: getLocalTimeZone(),
            })
                .formatToParts(at)
                .find((part) => part.type === "era")?.value;

        const eras = ids.map((eraId) => {
            const at = toIntlDate(getEraSample(id, eraId));

            return {
                id: eraId,
                name: readEra("long", at) ?? eraId,
                shortName: readEra("short", at) ?? eraId,
            };
        });

        eraCache.set(key, eras);

        return eras;
    };

    /**
     * Moves a date into another era, keeping its year, month and day numbers.
     *
     * Year numbers restart with each era, so this is what an era picker does: switching a Japanese date
     * from Heisei to Reiwa keeps "year 2, March 4th" and changes which year 2 that is.
     *
     * @param value The date to move.
     * @param era An era identifier from {@link DateValueUtils.getEras}.
     */
    export const withEra = (value: DateValue, era: string) =>
        getEraStart(getCalendarId(value), era).set({
            year: value.year,
            month: value.month,
            day: value.day,
        }) as DateValue;

    /**
     * How many months the date's year has.
     *
     * Not always twelve — a leap year in the Hebrew calendar has thirteen.
     */
    export const getMonthsInYear = (value: DateValue) => value.calendar.getMonthsInYear(value);

    /**
     * How many years the date's era runs for.
     *
     * @returns The count, or `Infinity` for an era with no end — which is most of them, including the
     * current one in any calendar still in use.
     */
    export const getYearsInEra = (value: DateValue) => value.calendar.getYearsInEra?.(value) ?? Infinity;

    /** How many days the date's month has. */
    export const getDaysInMonth = (value: DateValue) => value.calendar.getDaysInMonth(value);

    /** The first day of the date's month. */
    export const getStartOfMonth = (value: DateValue) => startOfMonth(value) as DateValue;

    /**
     * Shifts a date by a number of days.
     *
     * @param days How far to move. Negative goes backwards.
     */
    export const addDays = (value: DateValue, days: number) => value.add({ days }) as DateValue;

    /**
     * Shifts a date by a number of months, clamping the day to the month it lands in.
     *
     * The 31st plus one month lands on the 30th where the next month is short, rather than spilling
     * into the month after.
     *
     * @param months How far to move. Negative goes backwards.
     */
    export const addMonths = (value: DateValue, months: number) => value.add({ months }) as DateValue;

    /**
     * Shifts a date by a number of years, clamping the day to the month it lands in.
     *
     * @param years How far to move. Negative goes backwards.
     */
    export const addYears = (value: DateValue, years: number) => value.add({ years }) as DateValue;

    /**
     * Pulls a date inside a range of allowed dates.
     *
     * @param value The date to clamp.
     * @param min The earliest allowed date, if there is one.
     * @param max The latest allowed date, if there is one.
     * @returns `value` itself when it is already inside, otherwise whichever bound it passed.
     */
    export const clamp = (value: DateValue, min?: DateValue, max?: DateValue) => {
        if (min && compare(value, min) < 0) return min;
        if (max && compare(value, max) > 0) return max;

        return value;
    };

    /**
     * Builds a range from two dates, whichever way round they were given.
     *
     * Lets a drag selection across a calendar work backwards as well as forwards without the caller
     * sorting the ends out.
     */
    export const orderRange = (a: DateValue, b: DateValue): DateValueRange =>
        compare(a, b) <= 0 ? { start: a, end: b } : { start: b, end: a };

    /** Tests whether two ranges cover the same days. Two missing ranges count as the same. */
    export const isSameRange = (a: DateValueRange | undefined, b: DateValueRange | undefined) =>
        a === b || (a !== undefined && b !== undefined && isSame(a.start, b.start) && isSame(a.end, b.end));

    /**
     * Tests whether a date falls in a range, both ends included.
     *
     * @returns `false` when there is no range, so a caller need not special-case an unselected state.
     */
    export const getIsWithin = (value: DateValue, range: DateValueRange | undefined) =>
        range !== undefined && compare(value, range.start) >= 0 && compare(value, range.end) <= 0;

    /**
     * Tests whether a date satisfies a minimum and a maximum, both included.
     *
     * Unlike {@link DateValueUtils.getIsWithin} this takes the bounds separately and treats a missing
     * one as no limit, which is what a picker's `min` and `max` props mean.
     */
    export const getIsInRange = (value: DateValue, min?: DateValue, max?: DateValue) =>
        (!min || compare(value, min) >= 0) && (!max || compare(value, max) <= 0);

    /**
     * Which column a date falls in, given where the week starts.
     *
     * @param value The date to place.
     * @param weekStartsOn `0` for Sunday through to `6` for Saturday.
     * @returns `0` for the first column of the week through to `6` for the last.
     */
    export const getWeekdayOffset = (value: DateValue, weekStartsOn: DateValueWeekStart) =>
        (toIntlDate(value).getDay() - weekStartsOn + DAYS_PER_WEEK) % DAYS_PER_WEEK;

    /**
     * Builds the six-by-seven grid a month view draws.
     *
     * The grid starts on the week containing the first of the month, so it opens with a few days of
     * the previous month and closes with a few of the next; those are real dates rather than blanks, so
     * a view can draw them faded or make them selectable as it likes. Six rows always, which keeps the
     * calendar from changing height when the user pages between months.
     *
     * @param value Any date in the month to build.
     * @param weekStartsOn `0` for Sunday through to `6` for Saturday.
     * @returns The `anchor`, which is the first of the month being shown, and `weeks` as six rows of
     * seven days.
     */
    export const getMonthGrid = (value: DateValue, weekStartsOn: DateValueWeekStart): DateValueMonthGrid => {
        const anchor = getStartOfMonth(value);
        const start = addDays(anchor, -getWeekdayOffset(anchor, weekStartsOn));

        return {
            anchor,
            weeks: Array.from({ length: GRID_WEEKS }, (_, week) =>
                Array.from({ length: DAYS_PER_WEEK }, (_, day) => addDays(start, week * DAYS_PER_WEEK + day)),
            ),
        };
    };

    /**
     * Finds where a date sits in a grid.
     *
     * @param grid A grid from {@link DateValueUtils.getMonthGrid}.
     * @param value The date to look for.
     * @returns Its column and row, or `undefined` when the grid does not reach it. A date can appear in
     * the leading or trailing days of a neighbouring month's grid, so the answer depends on which grid
     * is asked.
     */
    export const getCellOf = (grid: DateValueMonthGrid, value: DateValue) => {
        for (let y = 0; y < grid.weeks.length; y += 1) {
            const x = grid.weeks[y].findIndex((day) => isSame(day, value));

            if (x >= 0) return { x, y };
        }

        return undefined;
    };

    /**
     * Breaks a date into the plain numbers and identifiers a segmented input edits.
     *
     * The inverse of {@link DateValueUtils.fromParts}. Nothing is validated on the way out.
     */
    export const toParts = (value: DateValue): DateValueParts => ({
        calendar: getCalendarId(value),
        era: value.era,
        year: value.year,
        month: value.month,
        day: value.day,
    });

    /**
     * Rebuilds a date from plain parts, rejecting anything that is not a real date.
     *
     * A segmented input can hold nonsense while the user is halfway through typing — February 31st, an
     * era that calendar does not have — and this is where that is caught. The check is that the date
     * built from the parts still reports the same parts back, which catches a value that was silently
     * clamped.
     *
     * @param parts The calendar, era, year, month and day to build from.
     * @returns The date, or `undefined` when those parts do not name a real day.
     */
    export const fromParts = (parts: DateValueParts): DateValue | undefined => {
        const calendar = getCalendarOf(parts.calendar);

        if (!calendar.getEras().includes(parts.era)) return undefined;

        const built = new CalendarDate(calendar, parts.era, parts.year, parts.month, parts.day);

        if (built.year !== parts.year || built.month !== parts.month || built.day !== parts.day) return undefined;

        return built;
    };

    /**
     * Writes a date as `YYYY-MM-DD`.
     *
     * Always Gregorian, whatever calendar the date was in, since that is what the ISO form means and
     * what a form submission or a stored value should carry.
     */
    export const toIso = (value: DateValue) => withCalendar(value, DEFAULT_CALENDAR_ID).toString();

    /**
     * Reads a date from `YYYY-MM-DD`, rejecting anything that is not a real date.
     *
     * Parsing is strict: the text must be exactly the ISO shape and must name a day that exists, so
     * `2023-02-30` is refused rather than rolled forward. Astronomical year numbering is accepted for
     * years before 1 — `0000` is 1 BC — but a negative zero is not, having no meaning.
     *
     * @param text The text to read.
     * @param id The calendar to express the result in. The text itself is always read as Gregorian.
     * @returns The date, or `undefined` when the text is not a valid ISO date.
     */
    export const fromIso = (text: string, id: DateValueCalendarId = DEFAULT_CALENDAR_ID): DateValue | undefined => {
        const parts = ISO_PATTERN.exec(text);

        if (!parts) return undefined;

        const year = Number(parts[1]);
        const month = Number(parts[2]);
        const day = Number(parts[3]);

        if (parts[1].startsWith("-") && year === 0) return undefined;

        const built = fromAstronomicalYear(year, month, day);

        if (built.year !== (year > 0 ? year : 1 - year) || built.month !== month || built.day !== day) {
            return undefined;
        }

        return withCalendar(built, id);
    };

    /**
     * The month names of a date's year, in the given locale.
     *
     * Taken from the year the date is in rather than in general, because in a calendar with leap months
     * both the names and how many there are depend on the year.
     *
     * @param value Any date in the year being asked about.
     * @param locale The locale to name them in. The platform's default is used when omitted.
     * @returns One name per month, in order. Cached per calendar, locale, era and year.
     */
    export const getMonthNames = (value: DateValue, locale?: string) => {
        const id = getCalendarId(value);
        const key = `${id}:${locale ?? ""}:${value.era}:${value.year}`;
        const cached = monthNameCache.get(key);

        if (cached) return cached;

        const formatter = new Intl.DateTimeFormat(locale, {
            month: "long",
            calendar: id,
            timeZone: getLocalTimeZone(),
        });
        const anchor = getStartOfMonth(value);
        const names = Array.from({ length: getMonthsInYear(value) }, (_, month) =>
            formatter.format(toIntlDate(anchor.set({ month: month + 1, day: 1 }))),
        );

        monthNameCache.set(key, names);

        return names;
    };

    /**
     * The weekday names, starting from the given day of the week.
     *
     * @param weekStartsOn `0` for Sunday through to `6` for Saturday. The returned names are rotated so
     * the first entry is that day, matching the columns {@link DateValueUtils.getMonthGrid} produces.
     * @param width `"narrow"` for a letter or two, `"short"` for an abbreviation, `"long"` for the full
     * name.
     * @param locale The locale to name them in. The platform's default is used when omitted.
     */
    export const getWeekdayNames = (
        weekStartsOn: DateValueWeekStart,
        width: DateValueWeekdayWidth,
        locale?: string,
    ) => {
        const formatter = new Intl.DateTimeFormat(locale, { weekday: width });

        return Array.from({ length: DAYS_PER_WEEK }, (_, index) =>
            formatter.format(new Date(2021, 7, 1 + ((index + weekStartsOn) % DAYS_PER_WEEK), 12)),
        );
    };

    /**
     * Formats a date through `Intl`, in its own calendar and the local time zone.
     *
     * @param value The date to format.
     * @param options Anything `Intl.DateTimeFormat` accepts. The calendar and time zone are supplied
     * and cannot be overridden.
     * @param locale The locale to format in. The platform's default is used when omitted.
     */
    export const format = (value: DateValue, options?: Intl.DateTimeFormatOptions, locale?: string) =>
        new Intl.DateTimeFormat(locale, {
            ...options,
            calendar: getCalendarId(value),
            timeZone: getLocalTimeZone(),
        }).format(toIntlDate(value));
}
