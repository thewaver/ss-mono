import type { JSX } from "solid-js";

import type { BaseDateTimePickerCbs, BaseDateTimePickerValues, DateTimeValue } from "@thewaver/ss-components";

import type { AccessorProps, AccessorValues, SignalSource } from "../../../Utils/typeUtils";
import type { ClockColumnRenderer, ClockOptionRenderer, ClockUnitRenderer } from "../Clock/ClockSolid.types";
import type { DatePickerProps } from "../DatePicker/DatePickerSolid.types";
import type { TimePickerProps } from "../TimePicker/TimePickerSolid.types";

export type DateTimePickerProps = Omit<
    DatePickerProps,
    "value" | "ariaLabel" | "visibility" | "minValue" | "maxValue" | "precision" | "id" | "name"
> &
    AccessorValues<BaseDateTimePickerValues> &
    BaseDateTimePickerCbs &
    AccessorProps<{
        /** The date and time together. A pair with a half missing is not a value at all. */
        value: SignalSource<DateTimeValue | undefined>;
        /** Whether the calendar is open. It is the only thing that opens or closes it. */
        dateVisibility?: SignalSource<boolean>;
        /** Whether the clock is open. It is the only thing that opens or closes it. */
        timeVisibility?: SignalSource<boolean>;
        /** Draws whatever sits between the two halves. */
        renderSeparator?: () => JSX.Element;
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
    }>;
