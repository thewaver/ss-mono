import { TimeUtils } from "@thewaver/ss-utils";
import type { TimeValue, TimeValueMeridiem } from "@thewaver/ss-utils";

import type { ClockUnit } from "./Clock.types";

/** What each column is called in `Intl`'s vocabulary. */
const NAME_FIELDS: Record<ClockUnit, Intl.DateTimeFormatPartTypes> = {
    hour: "hour",
    minute: "minute",
    second: "second",
    meridiem: "dayPeriod",
};

/** How many distinct readings each unit has. */
const UNIT_LENGTHS: Record<ClockUnit, number> = { hour: 24, minute: 60, second: 60, meridiem: 2 };
/** Hours in a twelve-hour column. */
const TWELVE_HOUR_LENGTH = 12;

/** An hour safely inside the morning and one safely inside the afternoon, for asking `Intl` what each is called. */
const MERIDIEM_ANCHOR_HOURS: Record<TimeValueMeridiem, number> = { am: 9, pm: 21 };
/** Part of an arbitrary date to hang those hours off. Only the hour matters. */
const MERIDIEM_ANCHOR_YEAR = 2021;
/** Part of an arbitrary date to hang those hours off. */
const MERIDIEM_ANCHOR_MONTH = 7;
/** Part of an arbitrary date to hang those hours off. */
const MERIDIEM_ANCHOR_DAY = 1;

/**
 * Reads and writes one column of a time picker.
 *
 * The columns differ from one another more than they look: the hour column shows twelve or
 * twenty-four values depending on the locale, `12` sits where `0` would be in a twelve-hour column,
 * and the morning-or-afternoon column is two named values rather than numbers. Collecting that here
 * lets the component treat every column the same way.
 */
export namespace ClockUtils {
    /** Morning first, afternoon second — the order the column shows them in, and the order their indices follow. */
    export const MERIDIEMS: TimeValueMeridiem[] = ["am", "pm"];

    /**
     * What a column is called, for its accessible label.
     *
     * @param unit Which column.
     * @param locale The locale to name it in. The platform's default when omitted.
     * @returns The localised name, falling back to the unit's own key where the platform has none.
     */
    export const getUnitName = (unit: ClockUnit, locale?: string) =>
        new Intl.DisplayNames(locale ?? [], { type: "dateTimeField" }).of(NAME_FIELDS[unit]) ?? unit;

    /**
     * What the morning and afternoon are called in a locale.
     *
     * @param locale The locale to ask about. The platform's default when omitted.
     * @returns Both names. Empty strings where the platform will not give them up.
     */
    export const getMeridiemNames = (locale?: string): Record<TimeValueMeridiem, string> => {
        const formatter = new Intl.DateTimeFormat(locale, { hour: "numeric", hour12: true });

        const read = (hour: number) =>
            formatter
                .formatToParts(new Date(MERIDIEM_ANCHOR_YEAR, MERIDIEM_ANCHOR_MONTH, MERIDIEM_ANCHOR_DAY, hour))
                .find((part) => part.type === "dayPeriod")?.value ?? "";

        return { am: read(MERIDIEM_ANCHOR_HOURS.am), pm: read(MERIDIEM_ANCHOR_HOURS.pm) };
    };

    /**
     * What a column currently shows.
     *
     * @param unit Which column.
     * @param time The whole time.
     * @param isTwelveHour Whether the hour column runs one to twelve.
     * @returns The number the column shows, or for the morning-or-afternoon column its index into
     * {@link ClockUtils.MERIDIEMS}. A time with no seconds reads as zero in the seconds column.
     */
    export const getReading = (unit: ClockUnit, time: TimeValue, isTwelveHour: boolean) => {
        if (unit === "hour") return isTwelveHour ? TimeUtils.getTwelveHour(time) : time.hour;
        if (unit === "minute") return time.minute;
        if (unit === "second") return time.second ?? 0;

        return MERIDIEMS.indexOf(TimeUtils.getMeridiem(time));
    };

    /**
     * The time that results from setting one column.
     *
     * @param unit Which column changed.
     * @param reading Its new value, as {@link ClockUtils.getReading} would report it.
     * @param time The time before the change.
     * @param isTwelveHour Whether the hour column runs one to twelve.
     * @returns The new time. Changing the morning-or-afternoon column shifts the hour by twelve rather
     * than replacing anything, so the minutes are untouched.
     */
    export const withReading = (
        unit: ClockUnit,
        reading: number,
        time: TimeValue,
        isTwelveHour: boolean,
    ): TimeValue => {
        if (unit === "meridiem") return TimeUtils.withMeridiem(time, MERIDIEMS[reading]);
        if (unit === "minute") return { ...time, minute: reading };
        if (unit === "second") return { ...time, second: reading };
        if (!isTwelveHour) return { ...time, hour: reading };

        return TimeUtils.fromTwelveHour(reading, time.minute, TimeUtils.getMeridiem(time), time.second) ?? time;
    };

    /**
     * Every value a column offers.
     *
     * @param unit Which column.
     * @param isTwelveHour Whether the hour column runs one to twelve.
     * @param step How many units apart the values should be — every fifth minute, say. Ignored for the
     * morning-or-afternoon column, which has only two values.
     * @returns The values in order. A twelve-hour column starts at `12` rather than `0`, which is how
     * clocks are written.
     */
    export const getReadings = (unit: ClockUnit, isTwelveHour: boolean, step: number) => {
        const isTwelveHourColumn = unit === "hour" && isTwelveHour;
        const length = isTwelveHourColumn ? TWELVE_HOUR_LENGTH : UNIT_LENGTHS[unit];
        const stride = unit === "meridiem" ? 1 : Math.max(1, Math.floor(step));

        return Array.from({ length: Math.ceil(length / stride) }, (_, index) => {
            const reading = index * stride;

            return isTwelveHourColumn && reading === 0 ? TWELVE_HOUR_LENGTH : reading;
        });
    };

    /**
     * Which of a column's values is closest to a given one.
     *
     * Needed because a column stepping by five cannot show every minute, so a time of `07:03` has to
     * land somewhere.
     *
     * @param readings The column's values.
     * @param target The value to match.
     * @returns The index of the closest, preferring the earlier one on a tie.
     */
    export const getNearestIndex = (readings: number[], target: number) =>
        readings.reduce(
            (best, reading, index) => (Math.abs(reading - target) < Math.abs(readings[best] - target) ? index : best),
            0,
        );
}
