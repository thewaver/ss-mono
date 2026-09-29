import type { DateValue, DateValueCalendarId, DateValueEra } from "../../../Abstracts/DateValue/DateValue.types";
import { DateValueUtils } from "../../../Abstracts/DateValue/DateValue.utils";
import { TextSyncUtils } from "../../../Abstracts/TextSync/TextSync.utils";
import type { DateInputFormat, DateInputPart } from "./DateInput.types";

/** Digits in the year part. */
const YEAR_LENGTH = 4;
/** Digits in the month part. */
const MONTH_LENGTH = 2;
/** Digits in the day part. */
const DAY_LENGTH = 2;

/** How many digits each part is written with. */
const PART_LENGTHS: Record<DateInputPart, number> = {
    year: YEAR_LENGTH,
    month: MONTH_LENGTH,
    day: DAY_LENGTH,
};

/** The order each format writes the parts in, and what it puts between them. */
const FORMATS: Record<DateInputFormat, { parts: DateInputPart[]; separator: string }> = {
    "iso": { parts: ["year", "month", "day"], separator: "-" },
    "day-month-year": { parts: ["day", "month", "year"], separator: "/" },
    "month-day-year": { parts: ["month", "day", "year"], separator: "/" },
};

/**
 * The rules a typed date field follows: how each format is masked and hinted, which digits cannot be a date, and
 * how digits become a date and back.
 *
 * The field is one input over a digits-only mask, so everything here works on the run of digits typed so far rather
 * than on the text, and the order of the parts is stated by the format rather than read out of a pattern.
 */
export namespace DateInputUtils {
    /** How many digits a complete date has, whatever its format. */
    export const DIGIT_COUNT = YEAR_LENGTH + MONTH_LENGTH + DAY_LENGTH;

    /** The smallest and largest number each part may hold. */
    export type Bounds = Record<DateInputPart, { min: number; max: number }>;

    /**
     * The mask a format types through.
     *
     * @param format The order the parts are written in.
     * @returns A `TextSyncUtils` pattern, such as `####-##-##` or `##/##/####`.
     */
    export const computeMask = (format: DateInputFormat) => {
        const { parts, separator } = FORMATS[format];

        return parts.map((part) => TextSyncUtils.MASK_DIGIT.repeat(PART_LENGTHS[part])).join(separator);
    };

    /**
     * The hint that tells a reader what to type, such as `dd/mm/yyyy`.
     *
     * @param format The order the parts are written in.
     * @param partHints The letters standing for each part.
     * @returns The letters in the format's order, joined by its separator.
     */
    export const computeHint = (format: DateInputFormat, partHints: Record<DateInputPart, string>) => {
        const { parts, separator } = FORMATS[format];

        return parts.map((part) => partHints[part]).join(separator);
    };

    /**
     * How large each part may be, in the calendar and era of a given date.
     *
     * The day's ceiling is the longest month of that year rather than the month being typed, because a 30th of
     * February is two parts disagreeing rather than one part being impossible — that stays the whole date's to
     * refuse.
     *
     * @param anchor Any date in the year the field is typing into, usually its value or today.
     * @returns A range per part: years run to the length of the era, months to the calendar's count for the year.
     */
    export const computeBounds = (anchor: DateValue): Bounds => {
        const monthCount = DateValueUtils.getMonthsInYear(anchor);
        const dayCeiling = Array.from({ length: monthCount }, (_, month) =>
            DateValueUtils.getDaysInMonth(anchor.set({ month: month + 1, day: 1 })),
        ).reduce((longest, days) => Math.max(longest, days), 1);

        return {
            year: { min: 1, max: DateValueUtils.getYearsInEra(anchor) },
            month: { min: 1, max: monthCount },
            day: { min: 1, max: dayCeiling },
        };
    };

    /**
     * Tests whether two anchors give the same bounds, which is what lets a caller skip recomputing them.
     *
     * @returns `true` when both are in the same calendar, era and year.
     */
    export const getIsSameAnchor = (a: DateValue, b: DateValue) =>
        a.era === b.era && a.year === b.year && a.calendar.identifier === b.calendar.identifier;

    /**
     * Tests whether any finished part of the digits typed so far is out of range.
     *
     * A part still being typed is not judged, so `1` never has to answer for the month it might become.
     *
     * @param digits The digits typed so far.
     * @param format The order the parts are written in.
     * @param bounds What {@link DateInputUtils.computeBounds} answered.
     */
    export const getHasImpossiblePart = (digits: string, format: DateInputFormat, bounds: Bounds) => {
        const { parts } = FORMATS[format];

        return TextSyncUtils.readGroups(
            digits,
            parts.map((part) => PART_LENGTHS[part]),
        ).some((value, index) => value < bounds[parts[index]].min || value > bounds[parts[index]].max);
    };

    /**
     * Reads the parts out of a run of digits in a format's order.
     *
     * @returns The number each part holds. A part the digits do not reach reads as `0`.
     */
    export const readParts = (digits: string, format: DateInputFormat) => {
        const values: Partial<Record<DateInputPart, number>> = {};

        let offset = 0;

        for (const part of FORMATS[format].parts) {
            values[part] = Number(digits.slice(offset, offset + PART_LENGTHS[part]));
            offset += PART_LENGTHS[part];
        }

        return values;
    };

    /**
     * Writes a date as the run of digits a format types it with.
     *
     * @returns Eight digits, each part padded with zeros, the year being the year within the date's era.
     */
    export const toDigits = (value: DateValue, format: DateInputFormat) =>
        FORMATS[format].parts.map((part) => `${value[part]}`.padStart(PART_LENGTHS[part], "0")).join("");

    /**
     * Reads a complete run of digits as a date.
     *
     * The date itself decides whether it exists, so 31 February is refused in every order rather than once per
     * order.
     *
     * @param digits The digits typed.
     * @param opts.format The order the parts are written in.
     * @param opts.calendar The calendar system the digits are counted in.
     * @param opts.era The era the year is counted within.
     * @param opts.minValue The earliest date accepted, if there is one.
     * @param opts.maxValue The latest date accepted, if there is one.
     * @returns The date, or `undefined` when the digits are incomplete, do not name a real day, or fall outside the
     * bounds.
     */
    export const parseDigits = (
        digits: string,
        opts: {
            format: DateInputFormat;
            calendar: DateValueCalendarId;
            era: string;
            minValue?: DateValue;
            maxValue?: DateValue;
        },
    ) => {
        if (digits.length !== DIGIT_COUNT) return undefined;

        const parts = readParts(digits, opts.format);
        const parsed = DateValueUtils.fromParts({
            calendar: opts.calendar,
            era: opts.era,
            year: parts.year!,
            month: parts.month!,
            day: parts.day!,
        });

        return parsed && DateValueUtils.getIsInRange(parsed, opts.minValue, opts.maxValue) ? parsed : undefined;
    };

    /**
     * The era a field starts on.
     *
     * @param value The field's value, if it has one.
     * @param options The eras the calendar reports, earliest first.
     * @returns The value's own era, or the latest era when there is no value.
     */
    export const getInitialEra = (value: DateValue | undefined, options: DateValueEra[]) =>
        value ? value.era : options[options.length - 1].id;

    /**
     * The date that results from moving a value into another era.
     *
     * @returns The same year, month and day counted within `era`, pulled back inside the bounds.
     */
    export const withEra = (value: DateValue, era: string, minValue?: DateValue, maxValue?: DateValue) =>
        DateValueUtils.clamp(DateValueUtils.withEra(value, era), minValue, maxValue);
}
