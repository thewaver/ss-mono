import type { VNodeChild } from "vue";

import type { ClockSteps, DateTimeValue } from "@thewaver/ss-components";
import type { TimeValue, TimeValueUnit } from "@thewaver/ss-utils";

import type { ClockColumnRenderer, ClockOptionRenderer, ClockUnitRenderer } from "../Clock/Clock.types";
import type { DatePickerProps, DatePickerSlots } from "../DatePicker/DatePicker.types";
import type { TimePickerSlots } from "../TimePicker/TimePicker.types";

export type DateTimePickerProps = Omit<
    DatePickerProps,
    | "value"
    | "onUpdate:value"
    | "ariaLabel"
    | "visibility"
    | "onUpdate:visibility"
    | "minValue"
    | "maxValue"
    | "precision"
    | "id"
    | "name"
> & {
    /**
     * The halves' element id. The date field takes `<id>-date` and the time field `<id>-time`, so a label can
     * name each one and no id lands on two elements.
     */
    "id"?: string;
    /** The halves' name when they are submitted as part of a form. They submit as `<name>-date` and `<name>-time`. */
    "name"?: string;
    /** Names the date half for assistive technology. */
    "dateLabel": string;
    /** Names the time half for assistive technology. */
    "timeLabel": string;
    /** Names the clock popup for assistive technology. */
    "clockLabel": string;
    /**
     * The earliest moment that can be picked. The calendar stops at its day, and the clock stops at its time
     * only while that day is the one picked, so every other day offers the whole clock.
     */
    "minValue"?: DateTimeValue;
    /**
     * The latest moment that can be picked. The calendar stops at its day, and the clock stops at its time only
     * while that day is the one picked.
     */
    "maxValue"?: DateTimeValue;
    /** Whether seconds are offered as well as hours and minutes. */
    "hasSeconds"?: boolean;
    /** Whether times are written as twelve hours with a morning and afternoon marker, or as twenty-four. */
    "isTwelveHour"?: boolean;
    /** The letters that stand for each part of the time in the time half's format hint. */
    "segmentHints": Record<TimeValueUnit, string>;
    /** How far apart the offered times are, per unit. */
    "clockSteps"?: ClockSteps;
    /** The space between the clock's columns. */
    "clockGap"?: number;
    /** Whether one time can be picked, for rules a plain earliest and latest cannot express. */
    "computeIsTimeDisabled"?: (time: TimeValue) => boolean;
    /**
     * The date and time together, which is what `v-model:value` binds. A pair with a half missing is not a value at
     * all.
     */
    "value": DateTimeValue | undefined;
    /** Receives the date and time once both halves are filled in, and `undefined` while either is missing. */
    "onUpdate:value"?: (value: DateTimeValue | undefined) => void;
    /**
     * Whether the calendar is open, which is what `v-model:dateVisibility` binds. Left unbound, the picker keeps its
     * own. It is the only thing that opens or closes it.
     */
    "dateVisibility"?: boolean;
    /** Receives the calendar opening or closing. */
    "onUpdate:dateVisibility"?: (isOpen: boolean) => void;
    /**
     * Whether the clock is open, which is what `v-model:timeVisibility` binds. Left unbound, the picker keeps its
     * own. It is the only thing that opens or closes it.
     */
    "timeVisibility"?: boolean;
    /** Receives the clock opening or closing. */
    "onUpdate:timeVisibility"?: (isOpen: boolean) => void;
    /** The clock trigger's own element id. */
    "timeTriggerId"?: string;
    /** Names the control that opens the clock. */
    "timeTriggerAriaLabel": string;
};

export type DateTimePickerSlots = DatePickerSlots & {
    /** Draws whatever sits between the two halves. */
    renderSeparator?: () => VNodeChild;
    /** Draws whatever else sits after the time field's text, before the control that opens the clock. */
    renderTimeTrailing?: TimePickerSlots["renderTrailing"];
    /** Draws what sits inside the control that opens the clock. */
    renderTimeTrigger: TimePickerSlots["renderTrigger"];
    /** Draws one clock option. */
    renderOption: ClockOptionRenderer;
    /** Draws the heading for one of the clock's columns. */
    renderUnit?: ClockUnitRenderer;
    /** Draws one of the clock's columns. */
    renderColumn?: ClockColumnRenderer;
    /** Draws the surface the clock sits on. */
    renderTimePopup: TimePickerSlots["renderPopup"];
};
