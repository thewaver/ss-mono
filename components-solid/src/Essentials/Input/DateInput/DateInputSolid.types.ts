import type { JSX } from "solid-js";

import type {
    BaseDateInputValues,
    DateInputEra,
    DateValue,
    InteractionFlags,
    TextFieldFlags,
} from "@thewaver/ss-components";

import type { TextFieldProps } from "../../../Primitives/TextField/TextFieldSolid.types";
import type { AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type DateInputProps = Omit<
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
    | "renderLeading"
    | "onInput"
    | "onBlur"
> &
    AccessorValues<BaseDateInputValues> & {
        /** The date. It is the only thing that changes it. */
        value: SignalSource<DateValue | undefined>;
        /** Draws whatever sits before the field's text, inside the field. */
        renderLeading?: (getFlags: () => InteractionFlags<TextFieldFlags>, era: DateInputEra) => JSX.Element;
    };
