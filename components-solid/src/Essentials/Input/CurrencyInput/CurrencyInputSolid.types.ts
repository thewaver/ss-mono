import type { BaseCurrencyInputValues } from "@thewaver/ss-components";

import type { TextFieldProps } from "../../../Primitives/TextField/TextFieldSolid.types";
import type { AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type CurrencyInputProps = Omit<
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
    | "step"
    | "onInput"
    | "onBlur"
> &
    AccessorValues<BaseCurrencyInputValues> & {
        /** The amount. It is the only thing that changes it. */
        value: SignalSource<number | undefined>;
    };
