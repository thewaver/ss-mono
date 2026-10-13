import type { BaseCurrencyInputProps } from "@thewaver/ss-components";

import type { TextFieldProps } from "../../../Primitives/TextField/TextField.types";

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
    BaseCurrencyInputProps & {
        /** The amount, and how to change it. It is the only thing that changes it. */
        value: readonly [number | undefined, (value: number | undefined) => void];
    };
