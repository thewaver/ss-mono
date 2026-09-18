import type { JSX } from "solid-js";

import type { TimeValue, TimeValueMeridiem } from "@thewaver/ss-utils";

import type { InteractionFlags } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { TextFieldFlags, TextFieldProps } from "../../../Primitives/TextField/TextField.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";

export type TimeInputMeridiem = {
    getValue: () => TimeValueMeridiem;
    set: (meridiem: TimeValueMeridiem) => void;
    toggle: () => void;
};

export type TimeInputProps = Omit<
    TextFieldProps,
    | "valueSignal"
    | "element"
    | "type"
    | "inputMode"
    | "computeMaskedText"
    | "placeholderHint"
    | "isSpinButton"
    | "isAutoSizing"
    | "minRows"
    | "maxRows"
    | "min"
    | "max"
    | "step"
    | "renderTrailing"
    | "onInput"
    | "onBlur"
    | "onKeyDown"
> &
    AccessorProps<{
        /** The earliest time that can be entered. */
        minTime?: TimeValue;
        /** The latest time that can be entered. */
        maxTime?: TimeValue;
        /** Whether seconds are part of the value as well as hours and minutes. */
        hasSeconds?: boolean;
        /** Whether times are written as twelve hours with a morning and afternoon marker, or as twenty-four. */
        isTwelveHour?: boolean;
        /** The time. It is the only thing that changes it. */
        valueSignal: SignalSource<TimeValue | undefined>;
        /** Draws whatever sits after the field's text, inside the field. */
        renderTrailing?: (getFlags: () => InteractionFlags<TextFieldFlags>, meridiem: TimeInputMeridiem) => JSX.Element;
    }>;
