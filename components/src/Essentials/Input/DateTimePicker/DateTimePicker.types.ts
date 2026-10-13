import type { TimeValue, TimeValueUnit } from "@thewaver/ss-utils";

import type { DateTimeValue } from "../../../Abstracts/DateTimeValue/DateTimeValue.types";
import type { ClockSteps } from "../Clock/Clock.types";

export type BaseDateTimePickerValues = {
    /**
     * The halves' element id. The date field takes `<id>-date` and the time field `<id>-time`, so a label can
     * name each one and no id lands on two elements.
     */
    id?: string;
    /** The halves' name when they are submitted as part of a form. They submit as `<name>-date` and `<name>-time`. */
    name?: string;
    /** Names the date half for assistive technology. */
    dateLabel: string;
    /** Names the time half for assistive technology. */
    timeLabel: string;
    /** Names the clock popup for assistive technology. */
    clockLabel: string;
    /**
     * The earliest moment that can be picked. The calendar stops at its day, and the clock stops at its time
     * only while that day is the one picked, so every other day offers the whole clock.
     */
    minValue?: DateTimeValue;
    /**
     * The latest moment that can be picked. The calendar stops at its day, and the clock stops at its time only
     * while that day is the one picked.
     */
    maxValue?: DateTimeValue;
    /** Whether seconds are offered as well as hours and minutes. */
    hasSeconds?: boolean;
    /** Whether times are written as twelve hours with a morning and afternoon marker, or as twenty-four. */
    isTwelveHour?: boolean;
    /** The letters that stand for each part of the time in the time half's format hint. */
    segmentHints: Record<TimeValueUnit, string>;
    /** How far apart the offered times are, per unit. */
    clockSteps?: ClockSteps;
    /** The space between the clock's columns. */
    clockGap?: number;
    /** The clock trigger's own element id. */
    timeTriggerId?: string;
    /** Names the control that opens the clock. */
    timeTriggerAriaLabel: string;
};

export type BaseDateTimePickerCbs = {
    /** Whether one time can be picked, for rules a plain earliest and latest cannot express. */
    computeIsTimeDisabled?: (time: TimeValue) => boolean;
};

export type BaseDateTimePickerProps = BaseDateTimePickerValues & BaseDateTimePickerCbs;
