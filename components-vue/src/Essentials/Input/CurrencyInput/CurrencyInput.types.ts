import type { BaseCurrencyInputProps } from "@thewaver/ss-components";

import type { TextFieldProps } from "../../../Primitives/TextField/TextField.types";

export type CurrencyInputProps = Omit<
    TextFieldProps,
    | "value"
    | "onUpdate:value"
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
        /** The amount. It is the only thing that changes it. */
        "value": number | undefined;
        /** Receives the amount as it changes, which is what `v-model:value` binds. */
        "onUpdate:value"?: (value: number | undefined) => void;
    };
