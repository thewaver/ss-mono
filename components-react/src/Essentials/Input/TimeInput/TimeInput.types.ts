import type { ReactNode } from "react";

import type { BaseTimeInputProps, InteractionFlags, TextFieldFlags } from "@thewaver/ss-components";
import type { TimeValue, TimeValueMeridiem } from "@thewaver/ss-utils";

import type { TextFieldProps } from "../../../Primitives/TextField/TextField.types";

export type TimeInputMeridiem = {
    /** The half of the day the field reads its hour in. */
    value: TimeValueMeridiem;
    /** Moves the field into a half of the day, shifting the value by twelve hours when there is one. */
    set: (meridiem: TimeValueMeridiem) => void;
    /** Moves the field into the other half of the day. */
    toggle: () => void;
};

export type TimeInputProps = Omit<
    TextFieldProps,
    | "value"
    | "element"
    | "type"
    | "inputMode"
    | "computeMaskedText"
    | "placeholderHint"
    | "isSpinButton"
    | "computeSpinValue"
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
    BaseTimeInputProps & {
        /** The time, and how to change it. It is the only thing that changes it. */
        value: readonly [TimeValue | undefined, (value: TimeValue | undefined) => void];
        /** Draws whatever sits after the field's text, inside the field. */
        renderTrailing?: (flags: InteractionFlags<TextFieldFlags>, meridiem: TimeInputMeridiem) => ReactNode;
    };
