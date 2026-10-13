import type { VNodeChild } from "vue";

import type { BaseDateTimePickerProps, DateTimeValue } from "@thewaver/ss-components";

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
> &
    BaseDateTimePickerProps & {
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
