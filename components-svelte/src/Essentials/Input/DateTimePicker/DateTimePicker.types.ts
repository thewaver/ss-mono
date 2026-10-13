import type { Snippet } from "svelte";

import type { BaseDateTimePickerProps, DateTimeValue } from "@thewaver/ss-components";

import type { ClockColumnRenderer, ClockOptionRenderer, ClockUnitRenderer } from "../Clock/Clock.types.js";
import type { DatePickerProps } from "../DatePicker/DatePicker.types.js";
import type { TimePickerProps } from "../TimePicker/TimePicker.types.js";

export type DateTimePickerProps = Omit<
    DatePickerProps,
    "value" | "ariaLabel" | "visibility" | "minValue" | "maxValue" | "precision" | "id" | "name"
> &
    BaseDateTimePickerProps & {
        /**
         * The date and time together. Bind it with `bind:value`; it is the only thing that changes them. A pair with a
         * half missing is not a value at all.
         */
        value: DateTimeValue | undefined;
        /**
         * Whether the calendar is open. Bind it with `bind:dateVisibility` to drive or follow it; left unbound, the
         * picker keeps its own. It is the only thing that opens or closes the calendar.
         */
        dateVisibility?: boolean;
        /**
         * Whether the clock is open. Bind it with `bind:timeVisibility` to drive or follow it; left unbound, the picker
         * keeps its own. It is the only thing that opens or closes the clock.
         */
        timeVisibility?: boolean;
        /** Draws whatever sits between the two halves. */
        renderSeparator?: Snippet;
        /** Draws whatever else sits after the time field's text, before the control that opens the clock. */
        renderTimeTrailing?: TimePickerProps["renderTrailing"];
        /** Draws what sits inside the control that opens the clock. */
        renderTimeTrigger: TimePickerProps["renderTrigger"];
        /** Draws one clock option. */
        renderOption: ClockOptionRenderer;
        /** Draws the heading for one of the clock's columns. */
        renderUnit?: ClockUnitRenderer;
        /** Draws one of the clock's columns. */
        renderColumn?: ClockColumnRenderer;
        /** Draws the surface the clock sits on. */
        renderTimePopup: TimePickerProps["renderPopup"];
    };
