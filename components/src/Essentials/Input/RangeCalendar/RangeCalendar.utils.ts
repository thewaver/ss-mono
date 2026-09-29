import type { DateValue, DateValueRange } from "../../../Abstracts/DateValue/DateValue.types";
import { DateValueUtils } from "../../../Abstracts/DateValue/DateValue.utils";

/**
 * The half-entered state of a range being picked on a calendar.
 *
 * A range is picked in two presses, and between them there is a start but no range. That start is the
 * component's own — it is never reported to the consumer, because half a range is not a range — so these answer
 * every question the calendar asks from the pending start, the last day pressed and the consumer's range together.
 */
export namespace RangeCalendarUtils {
    /**
     * The day the calendar's highlight is anchored to.
     *
     * @param pendingStart The first end, while only one has been pressed.
     * @param lastPicked The day pressed most recently, if any.
     * @param range The consumer's range, if there is one.
     * @returns The pending start while there is one; otherwise the last day pressed while it is still one of the
     * range's ends, so the highlight stays where the reader left it; otherwise the range's start.
     */
    export const computeAnchorDay = (
        pendingStart: DateValue | undefined,
        lastPicked: DateValue | undefined,
        range: DateValueRange | undefined,
    ) => {
        if (pendingStart) return pendingStart;

        if (
            lastPicked &&
            (DateValueUtils.isSame(lastPicked, range?.start) || DateValueUtils.isSame(lastPicked, range?.end))
        ) {
            return lastPicked;
        }

        return range?.start;
    };

    /**
     * Tests whether a day is marked as picked.
     *
     * @returns While a start is pending, whether the day is that start; otherwise whether it is either end of the
     * range.
     */
    export const getIsSelected = (
        day: DateValue,
        pendingStart: DateValue | undefined,
        range: DateValueRange | undefined,
    ) => {
        if (pendingStart) return DateValueUtils.isSame(day, pendingStart);

        return DateValueUtils.isSame(day, range?.start) || DateValueUtils.isSame(day, range?.end);
    };

    /**
     * The range to band on the grid.
     *
     * @param highlighted The day the keyboard or pointer is on.
     * @returns While a start is pending, the span from it to the highlighted day, so the band follows the reader;
     * otherwise the consumer's range.
     */
    export const computePaintedRange = (
        highlighted: DateValue,
        pendingStart: DateValue | undefined,
        range: DateValueRange | undefined,
    ) => (pendingStart ? DateValueUtils.orderRange(pendingStart, highlighted) : range);

    /**
     * What a press on a day does.
     *
     * @param day The day pressed.
     * @param pendingStart The first end, while only one has been pressed.
     * @returns `pendingStart`, the start to hold from now on, and `range`, the value to hand the consumer. The first
     * press holds the day and clears the value; the second completes the range, ordered whichever end came first,
     * and holds nothing.
     */
    export const computePick = (day: DateValue, pendingStart: DateValue | undefined) =>
        pendingStart
            ? { pendingStart: undefined, range: DateValueUtils.orderRange(pendingStart, day) }
            : { pendingStart: day, range: undefined };
}
