import type { TimeValue } from "@thewaver/ss-utils";

import type { DateTimeValue } from "../../../Abstracts/DateTimeValue/DateTimeValue.types";
import type { DateValue } from "../../../Abstracts/DateValue/DateValue.types";
import { DateValueUtils } from "../../../Abstracts/DateValue/DateValue.utils";

/** The earliest time a day holds. */
const FIRST_SECOND_OF_DAY: TimeValue = { hour: 0, minute: 0, second: 0 };
/** The latest time a day holds. */
const LAST_SECOND_OF_DAY: TimeValue = { hour: 23, minute: 59, second: 59 };

/**
 * How a date-and-time picker's one pair of bounds is shared out between its calendar and its clock.
 *
 * A bound is a moment rather than a day plus a separate time, so the calendar stops at the bound's day and the
 * clock stops at the bound's time only on that day; on every other day the clock offers the whole day.
 */
export namespace DateTimePickerUtils {
    /**
     * The earliest time the clock offers.
     *
     * @param date The day picked, if one is.
     * @param bound The earliest moment allowed.
     * @returns The bound's own time while its day is the one picked, and the first second of the day otherwise.
     */
    export const computeMinTime = (date: DateValue | undefined, bound: DateTimeValue) =>
        date && DateValueUtils.isSame(date, bound.date) ? bound.time : FIRST_SECOND_OF_DAY;

    /**
     * The latest time the clock offers.
     *
     * @param date The day picked, if one is.
     * @param bound The latest moment allowed.
     * @returns The bound's own time while its day is the one picked, and the last second of the day otherwise.
     */
    export const computeMaxTime = (date: DateValue | undefined, bound: DateTimeValue) =>
        date && DateValueUtils.isSame(date, bound.date) ? bound.time : LAST_SECOND_OF_DAY;
}
