import type { JSX } from "solid-js";

import type { BaseTimeInputValues, InteractionFlags, TextFieldFlags, TimeInputMeridiem } from "@thewaver/ss-components";
import type { TimeValue } from "@thewaver/ss-utils";

import type { TextFieldProps } from "../../../Primitives/TextField/TextFieldSolid.types";
import type { AccessorValues, SignalSource } from "../../../Utils/typeUtils";

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
    AccessorValues<BaseTimeInputValues> & {
        /** The time. It is the only thing that changes it. */
        value: SignalSource<TimeValue | undefined>;
        /** Draws whatever sits after the field's text, inside the field. */
        renderTrailing?: (getFlags: () => InteractionFlags<TextFieldFlags>, meridiem: TimeInputMeridiem) => JSX.Element;
    };
