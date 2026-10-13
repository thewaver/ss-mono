import type { ReactNode } from "react";

import type { BaseDateTimePickerProps, DateTimeValue } from "@thewaver/ss-components";

import type { ClockColumnRenderer, ClockOptionRenderer, ClockUnitRenderer } from "../Clock/Clock.types";
import type { DatePickerProps } from "../DatePicker/DatePicker.types";
import type { TimePickerProps } from "../TimePicker/TimePicker.types";

export type DateTimePickerProps = Omit<
    DatePickerProps,
    "value" | "ariaLabel" | "visibility" | "minValue" | "maxValue" | "precision" | "id" | "name"
> &
    BaseDateTimePickerProps & {
        /** The date and time together, and how to change them. A pair with a half missing is not a value at all. */
        value: readonly [DateTimeValue | undefined, (value: DateTimeValue | undefined) => void];
        /** Whether the calendar is open, and how to change it. It is the only thing that opens or closes it. */
        dateVisibility?: readonly [boolean, (isOpen: boolean) => void];
        /** Whether the clock is open, and how to change it. It is the only thing that opens or closes it. */
        timeVisibility?: readonly [boolean, (isOpen: boolean) => void];
        /** Draws whatever sits between the two halves. */
        renderSeparator?: () => ReactNode;
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
