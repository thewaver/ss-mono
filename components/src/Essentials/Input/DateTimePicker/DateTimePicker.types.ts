import type { JSX } from "solid-js";

import type { TimeValue } from "@thewaver/ss-utils";

import type { DateTimeValue } from "../../../Abstracts/DateTimeValue/DateTimeValue.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";
import type { ClockColumnRenderer, ClockOptionRenderer, ClockSteps, ClockUnitRenderer } from "../Clock/Clock.types";
import type { DatePickerProps } from "../DatePicker/DatePicker.types";
import type { TimePickerProps } from "../TimePicker/TimePicker.types";

export type DateTimePickerProps = Omit<DatePickerProps, "valueSignal" | "ariaLabel" | "visibilitySignal"> &
    AccessorProps<{
        dateLabel?: string;
        timeLabel?: string;
        clockLabel?: string;
        minTime?: TimeValue;
        maxTime?: TimeValue;
        hasSeconds?: boolean;
        isTwelveHour?: boolean;
        clockSteps?: ClockSteps;
        clockGap?: number;
        computeIsTimeDisabled?: (time: TimeValue) => boolean;
        valueSignal: SignalSource<DateTimeValue | undefined>;
        dateVisibilitySignal?: SignalSource<boolean>;
        timeVisibilitySignal?: SignalSource<boolean>;
        renderSeparator?: () => JSX.Element;
        renderTimeTrailing: TimePickerProps["renderTrailing"];
        renderOption: ClockOptionRenderer;
        renderUnit?: ClockUnitRenderer;
        renderColumn?: ClockColumnRenderer;
        renderTimePopup: TimePickerProps["renderPopup"];
    }>;
