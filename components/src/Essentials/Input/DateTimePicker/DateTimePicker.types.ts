import type { JSX } from "solid-js";

import type { TimeValue } from "@thewaver/ss-utils";

import type { DateTimeValue } from "../../../Abstracts/DateTimeValue/DateTimeValue.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";
import type { ClockColumnRenderer, ClockOptionRenderer, ClockSteps, ClockUnitRenderer } from "../Clock/Clock.types";
import type { DatePickerProps } from "../DatePicker/DatePicker.types";
import type { TimePickerProps } from "../TimePicker/TimePicker.types";

export type DateTimePickerProps = Omit<DatePickerProps, "valueSignal" | "ariaLabel" | "visibilitySignal"> &
    AccessorProps<{
        /** Names the date half for assistive technology. */
        dateLabel?: string;
        /** Names the time half for assistive technology. */
        timeLabel?: string;
        /** Names the clock popup for assistive technology. */
        clockLabel?: string;
        /** The earliest time that can be picked. */
        minTime?: TimeValue;
        /** The latest time that can be picked. */
        maxTime?: TimeValue;
        /** Whether seconds are offered as well as hours and minutes. */
        hasSeconds?: boolean;
        /** Whether times are written as twelve hours with a morning and afternoon marker, or as twenty-four. */
        isTwelveHour?: boolean;
        /** How far apart the offered times are, per unit. */
        clockSteps?: ClockSteps;
        /** The space between the clock's columns. */
        clockGap?: number;
        /** Whether one time can be picked, for rules a plain earliest and latest cannot express. */
        computeIsTimeDisabled?: (time: TimeValue) => boolean;
        /** The date and time together. A pair with a half missing is not a value at all. */
        valueSignal: SignalSource<DateTimeValue | undefined>;
        /** Whether the calendar is open. It is the only thing that opens or closes it. */
        dateVisibilitySignal?: SignalSource<boolean>;
        /** Whether the clock is open. It is the only thing that opens or closes it. */
        timeVisibilitySignal?: SignalSource<boolean>;
        /** Draws whatever sits between the two halves. */
        renderSeparator?: () => JSX.Element;
        /** Draws whatever sits after the time field's text, inside the field. */
        renderTimeTrailing: TimePickerProps["renderTrailing"];
        /** Draws one clock option. */
        renderOption: ClockOptionRenderer;
        /** Draws the heading for one of the clock's columns. */
        renderUnit?: ClockUnitRenderer;
        /** Draws one of the clock's columns. */
        renderColumn?: ClockColumnRenderer;
        /** Draws the surface the clock sits on. */
        renderTimePopup: TimePickerProps["renderPopup"];
    }>;
