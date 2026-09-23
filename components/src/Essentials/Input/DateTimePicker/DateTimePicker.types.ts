import type { JSX } from "solid-js";

import type { TimeValue, TimeValueUnit } from "@thewaver/ss-utils";

import type { DateTimeValue } from "../../../Abstracts/DateTimeValue/DateTimeValue.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";
import type { ClockColumnRenderer, ClockOptionRenderer, ClockSteps, ClockUnitRenderer } from "../Clock/Clock.types";
import type { DatePickerProps } from "../DatePicker/DatePicker.types";
import type { TimePickerProps } from "../TimePicker/TimePicker.types";

export type DateTimePickerProps = Omit<
    DatePickerProps,
    "valueSignal" | "ariaLabel" | "visibilitySignal" | "minValue" | "maxValue" | "precision"
> &
    AccessorProps<{
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
        /** The clock trigger's own element id. */
        timeTriggerId?: string;
        /** Names the control that opens the clock. */
        timeTriggerAriaLabel: string;
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
