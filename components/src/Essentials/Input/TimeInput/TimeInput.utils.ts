import { TimeUtils } from "@thewaver/ss-utils";
import type { TimeValue, TimeValueMeridiem, TimeValueUnit } from "@thewaver/ss-utils";

import { TextSyncUtils } from "../../../Abstracts/TextSync/TextSync.utils";

/** Digits in one segment. */
const SEGMENT_LENGTH = 2;
/** What sits between two segments. */
const SEPARATOR = ":";
/** Characters from the start of one segment to the start of the next, separator included. */
const SEGMENT_STRIDE = SEGMENT_LENGTH + SEPARATOR.length;
/** The segments in the order the field writes them. */
const SEGMENT_UNITS: TimeValueUnit[] = ["hour", "minute", "second"];
/** How far each stepping key moves a segment. */
const STEP_KEYS: Record<string, number> = { ArrowUp: 1, ArrowDown: -1 };

/** The smallest and largest number each segment may hold on a twenty-four-hour field. */
const SEGMENT_BOUNDS: Record<TimeValueUnit, { min: number; max: number }> = {
    hour: { min: 0, max: 23 },
    minute: { min: 0, max: 59 },
    second: { min: 0, max: 59 },
};

/** The range of the hour segment on a twelve-hour field. */
const TWELVE_HOUR_BOUNDS = { min: 1, max: 12 };

/**
 * The rules a typed time field follows: its mask and hint, which digits cannot be a time, how its text is read in
 * twelve or twenty-four hours, and what the stepping keys do.
 *
 * The field is one input over a digits-only mask, so a segment is found from the caret offset — three characters
 * per segment including its separator — rather than from an element of its own.
 */
export namespace TimeInputUtils {
    /** Digits in one segment, which is also how many characters a stepped segment's selection spans. */
    export const SEGMENT_DIGITS = SEGMENT_LENGTH;

    /** The half of the day an empty twelve-hour field assumes until one is chosen. */
    export const DEFAULT_MERIDIEM: TimeValueMeridiem = "am";

    /**
     * How many segments the field shows.
     *
     * @returns Three with seconds, two without.
     */
    export const getSegmentCount = (hasSeconds: boolean) =>
        hasSeconds ? SEGMENT_UNITS.length : SEGMENT_UNITS.length - 1;

    /**
     * The segment the caret is in.
     *
     * @param caret The caret's offset into the text.
     * @returns Which unit the segment holds and the offset it starts at. A caret past the last segment is in the
     * last segment.
     */
    export const getSegmentAt = (caret: number) => {
        const index = Math.min(Math.floor(caret / SEGMENT_STRIDE), SEGMENT_UNITS.length - 1);

        return { unit: SEGMENT_UNITS[index], start: index * SEGMENT_STRIDE };
    };

    /**
     * The mask the field types through.
     *
     * @returns `##:##`, or `##:##:##` with three segments.
     */
    export const computeMask = (segmentCount: number) =>
        Array.from({ length: segmentCount }, () => TextSyncUtils.MASK_DIGIT.repeat(SEGMENT_LENGTH)).join(SEPARATOR);

    /**
     * The hint that tells a reader what to type, such as `hh:mm`.
     *
     * @param segmentHints The letters standing for each unit.
     * @returns The letters of the segments shown, joined with a colon.
     */
    export const computeHint = (segmentCount: number, segmentHints: Record<TimeValueUnit, string>) =>
        SEGMENT_UNITS.slice(0, segmentCount)
            .map((unit) => segmentHints[unit])
            .join(SEPARATOR);

    /**
     * Tests whether any finished segment of the digits typed so far is out of range.
     *
     * A segment still being typed is not judged. On a twelve-hour field the hour runs from 1 to 12.
     *
     * @param digits The digits typed so far.
     */
    export const getHasImpossibleSegment = (digits: string, segmentCount: number, isTwelveHour: boolean) => {
        const units = SEGMENT_UNITS.slice(0, segmentCount);

        return TextSyncUtils.readGroups(
            digits,
            units.map(() => SEGMENT_LENGTH),
        ).some((value, index) => {
            const bounds = units[index] === "hour" && isTwelveHour ? TWELVE_HOUR_BOUNDS : SEGMENT_BOUNDS[units[index]];

            return value < bounds.min || value > bounds.max;
        });
    };

    /**
     * Writes a time as the field shows it.
     *
     * @returns Twelve-hour text with no marker on a twelve-hour field, ISO text otherwise.
     */
    export const toText = (value: TimeValue, isTwelveHour: boolean) =>
        isTwelveHour ? TimeUtils.toTwelveHourText(value) : TimeUtils.toIso(value);

    /**
     * Writes a time as the run of digits the field types it with.
     *
     * @returns The digits of {@link TimeInputUtils.toText}.
     */
    export const toDigits = (value: TimeValue, isTwelveHour: boolean) =>
        TextSyncUtils.getMaskedDigits(toText(value, isTwelveHour));

    /**
     * Reads a complete run of digits as a time.
     *
     * A typed time does not wrap: `24:00` is not midnight, it is no time at all.
     *
     * @param digits The digits typed.
     * @param opts.segmentCount How many segments the field shows.
     * @param opts.isTwelveHour Whether the hour is read as one to twelve.
     * @param opts.meridiem The half of the day a twelve-hour reading falls in.
     * @param opts.minValue The earliest time accepted, if there is one.
     * @param opts.maxValue The latest time accepted, if there is one.
     * @returns The time in twenty-four hours, or `undefined` when the digits are incomplete, do not name a time, or
     * fall outside the bounds.
     */
    export const parseDigits = (
        digits: string,
        opts: {
            segmentCount: number;
            isTwelveHour: boolean;
            meridiem: TimeValueMeridiem;
            minValue?: TimeValue;
            maxValue?: TimeValue;
        },
    ) => {
        if (digits.length !== opts.segmentCount * SEGMENT_LENGTH) return undefined;

        const text = TextSyncUtils.formatWithMask(computeMask(opts.segmentCount), digits);
        const parsed = opts.isTwelveHour ? TimeUtils.fromTwelveHourText(text, opts.meridiem) : TimeUtils.fromIso(text);

        return parsed && TimeUtils.getIsInRange(parsed, opts.minValue, opts.maxValue) ? parsed : undefined;
    };

    /**
     * The meridiem a field starts on.
     *
     * @returns The value's own half of the day, or {@link TimeInputUtils.DEFAULT_MERIDIEM} when there is no value.
     */
    export const getInitialMeridiem = (value: TimeValue | undefined) =>
        value ? TimeUtils.getMeridiem(value) : DEFAULT_MERIDIEM;

    /**
     * The other half of the day.
     *
     * @returns `pm` for `am`, and `am` for `pm`.
     */
    export const toggleMeridiem = (meridiem: TimeValueMeridiem): TimeValueMeridiem => (meridiem === "am" ? "pm" : "am");

    /**
     * The time that results from moving a value into a half of the day.
     *
     * @returns The same reading in the other half, pulled back inside the bounds.
     */
    export const withMeridiem = (
        value: TimeValue,
        meridiem: TimeValueMeridiem,
        minValue?: TimeValue,
        maxValue?: TimeValue,
    ) => TimeUtils.clamp(TimeUtils.withMeridiem(value, meridiem), minValue, maxValue);

    /**
     * What a key press does to the segment the caret is in.
     *
     * Stepping wraps around the day and carries between segments, because a clock has no end; the bounds then clamp
     * it rather than wrapping it.
     *
     * @param key The `key` of the keyboard event.
     * @param value The time held, if any.
     * @param caret The caret's offset into the text.
     * @param minValue The earliest time allowed, if there is one.
     * @param maxValue The latest time allowed, if there is one.
     * @returns The stepped time and the selection that covers the stepped segment, so a run of presses keeps
     * landing on the same unit; or `undefined` when the key is not a stepping key or there is no time to step.
     */
    export const computeStep = (
        key: string,
        value: TimeValue | undefined,
        caret: number,
        minValue?: TimeValue,
        maxValue?: TimeValue,
    ) => {
        const delta = STEP_KEYS[key];

        if (delta === undefined || !value) return undefined;

        const segment = getSegmentAt(caret);

        return {
            time: TimeUtils.clamp(TimeUtils.addUnit(value, segment.unit, delta), minValue, maxValue),
            selectionStart: segment.start,
            selectionEnd: segment.start + SEGMENT_LENGTH,
        };
    };
}
