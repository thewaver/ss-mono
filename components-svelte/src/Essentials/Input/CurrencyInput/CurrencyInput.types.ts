import type { BaseCurrencyInputProps } from "@thewaver/ss-components";

import type { TextFieldProps } from "../../../Primitives/TextField/TextField.types.js";

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
        /**
         * The amount. Bind it with `bind:value`; it is the only thing that changes it. It reads `undefined` while the field
         * holds no complete amount.
         */
        value: number | undefined;
    };
