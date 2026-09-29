import { TimeUtils } from "@thewaver/ss-utils";
import type { TimeValue, TimeValueMeridiem } from "@thewaver/ss-utils";

import type { NavigatorDirection } from "../../../Abstracts/Navigator/Navigator.types";
import { NavigatorUtils } from "../../../Abstracts/Navigator/Navigator.utils";
import type { ClockColumn, ClockKeyAction, ClockSteps, ClockUnit } from "./Clock.types";

/** What each column is called in `Intl`'s vocabulary. */
const NAME_FIELDS: Record<ClockUnit, Intl.DateTimeFormatPartTypes> = {
    hour: "hour",
    minute: "minute",
    second: "second",
    meridiem: "dayPeriod",
};

/** How many distinct readings each unit has. */
const UNIT_LENGTHS: Record<ClockUnit, number> = { hour: 24, minute: 60, second: 60, meridiem: 2 };
/** How far apart a column's values are when no step is given for it. */
const DEFAULT_STEP = 1;
/** How many digits a number option is written with. */
const LABEL_DIGITS = 2;
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
     * @returns The localized name, falling back to the unit's own key where the platform has none.
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

    /**
     * A time of day read off a `Date`, to the second, in the local time zone.
     *
     * @param date The instant to read.
     */
    export const fromDate = (date: Date): TimeValue => ({
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
    });

    /**
     * The time every column's options are built from: the value, or now when there is none.
     *
     * Now is pulled inside the bounds, so a bounded clock opened outside them does not offer a column of options
     * that are all refused.
     *
     * @param value The picked time, if there is one.
     * @param now The time counted as now.
     * @param hasSeconds Whether the clock offers seconds, in which case the base always carries a second.
     * @param minValue The earliest time allowed, if there is one.
     * @param maxValue The latest time allowed, if there is one.
     */
    export const computeBase = (
        value: TimeValue | undefined,
        now: TimeValue,
        hasSeconds: boolean,
        minValue?: TimeValue,
        maxValue?: TimeValue,
    ): TimeValue => {
        const base = value ?? TimeUtils.clamp(now, minValue, maxValue);

        return hasSeconds ? { ...base, second: base.second ?? 0 } : base;
    };

    /**
     * The columns a clock shows, in order.
     *
     * @returns Hour and minute, then second when offered, then the morning-or-afternoon column on a twelve-hour
     * clock.
     */
    export const getUnits = (hasSeconds: boolean, isTwelveHour: boolean) => {
        const units: ClockUnit[] = ["hour", "minute"];

        if (hasSeconds) units.push("second");
        if (isTwelveHour) units.push("meridiem");

        return units;
    };

    /**
     * Every column with its options.
     *
     * Each option carries the whole time it would produce — the base with that one column changed — so whether it
     * is refused, whether it is picked and what a pick writes all fall out of it.
     *
     * @param units The columns, from {@link ClockUtils.getUnits}.
     * @param base The time the options are built from, from {@link ClockUtils.computeBase}.
     * @param isTwelveHour Whether the hour column runs one to twelve.
     * @param steps How far apart each column's values are. A column not named steps by one.
     * @param meridiemNames What the morning and afternoon are called, from {@link ClockUtils.getMeridiemNames}.
     * @returns One entry per unit, with its readings and an option per reading, labeled with two digits or with
     * the half of the day's name.
     */
    export const getColumns = (
        units: ClockUnit[],
        base: TimeValue,
        isTwelveHour: boolean,
        steps: ClockSteps,
        meridiemNames: Record<TimeValueMeridiem, string>,
    ): ClockColumn[] =>
        units.map((unit) => {
            const step = unit === "meridiem" ? DEFAULT_STEP : (steps[unit] ?? DEFAULT_STEP);
            const readings = getReadings(unit, isTwelveHour, step);

            return {
                unit,
                readings,
                options: readings.map((reading) => ({
                    unit,
                    time: withReading(unit, reading, base, isTwelveHour),
                    label:
                        unit === "meridiem"
                            ? meridiemNames[MERIDIEMS[reading]]
                            : String(reading).padStart(LABEL_DIGITS, "0"),
                })),
            };
        });

    /**
     * The column the clock's one tab stop is in.
     *
     * @param unit The column the keyboard last moved to, if any.
     * @param units The columns shown.
     * @returns That column while it is still shown, otherwise the first.
     */
    export const resolveRovingUnit = (unit: ClockUnit | undefined, units: ClockUnit[]) =>
        unit && units.includes(unit) ? unit : units[0];

    /**
     * Which option of a column reads the roving time.
     *
     * @param column The column.
     * @param time The time the keyboard is on.
     * @param isTwelveHour Whether the hour column runs one to twelve.
     * @returns The index of the nearest reading, since a stepped column cannot show every value.
     */
    export const getRovingIndex = (column: ClockColumn, time: TimeValue, isTwelveHour: boolean) =>
        getNearestIndex(column.readings, getReading(column.unit, time, isTwelveHour));

    /**
     * Tests whether an option shows the reading a given time has in its column.
     *
     * @param column The option's column.
     * @param index The option's index in it.
     * @param time The time to test, if any.
     * @returns `false` when there is no time.
     */
    export const getIsAt = (column: ClockColumn, index: number, time: TimeValue | undefined, isTwelveHour: boolean) =>
        time !== undefined && getReading(column.unit, time, isTwelveHour) === column.readings[index];

    /**
     * Tests whether a time can be picked.
     *
     * @param time The time an option would produce.
     * @param opts.isDisabled Whether the whole clock is off.
     * @param opts.minValue The earliest time allowed, if there is one.
     * @param opts.maxValue The latest time allowed, if there is one.
     * @param opts.computeIsTimeDisabled The consumer's own rule.
     */
    export const getIsTimeDisabled = (
        time: TimeValue,
        opts: {
            isDisabled?: boolean;
            minValue?: TimeValue;
            maxValue?: TimeValue;
            computeIsTimeDisabled?: (time: TimeValue) => boolean;
        },
    ) =>
        (opts.isDisabled ?? false) ||
        !TimeUtils.getIsInRange(time, opts.minValue, opts.maxValue) ||
        (opts.computeIsTimeDisabled?.(time) ?? false);

    /**
     * What a key pressed on the clock does.
     *
     * Enter and Space pick the roving option. Up and down move within the column and wrap, Home and End go to its
     * ends, and moving the highlight does not pick anything. Left and right cross to the neighboring column,
     * flipped under right-to-left, which then reads the same roving time its own way.
     *
     * @param key The `key` of the keyboard event.
     * @param opts.columns The columns shown.
     * @param opts.rovingUnit The column the tab stop is in.
     * @param opts.rovingTime The time the keyboard is on.
     * @param opts.isTwelveHour Whether the hour column runs one to twelve.
     * @param opts.direction Which way the clock's text runs.
     * @returns A time to pick, a time to move the highlight to, or a column to move into; `undefined` when the key
     * is not the clock's.
     */
    export const computeKeyAction = (
        key: string,
        opts: {
            columns: ClockColumn[];
            rovingUnit: ClockUnit;
            rovingTime: TimeValue;
            isTwelveHour: boolean;
            direction: NavigatorDirection;
        },
    ): ClockKeyAction | undefined => {
        const { columns, rovingTime, isTwelveHour } = opts;
        const unitIndex = columns.findIndex((column) => column.unit === opts.rovingUnit);
        const column = columns[unitIndex];

        if (!column) return undefined;

        const index = getRovingIndex(column, rovingTime, isTwelveHour);

        if (NavigatorUtils.getIsActivationKey(key)) {
            return {
                kind: "pick",
                time: withReading(column.unit, column.readings[index], rovingTime, isTwelveHour),
                unit: column.unit,
            };
        }

        const nextIndex = NavigatorUtils.computeNextPosition(key, index, column.readings.length, {
            orientation: "vertical",
        });

        if (nextIndex !== undefined) {
            return {
                kind: "highlight",
                time: withReading(column.unit, column.readings[nextIndex], rovingTime, isTwelveHour),
            };
        }

        const nextUnitIndex = NavigatorUtils.computeNextPosition(key, unitIndex, columns.length, {
            orientation: "horizontal",
            direction: opts.direction,
            hasEdgeKeys: false,
        });

        if (nextUnitIndex === undefined) return undefined;

        return { kind: "unit", unit: columns[nextUnitIndex].unit };
    };
}
