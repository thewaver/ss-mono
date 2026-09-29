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
> & {
    /** How many digits are kept after the decimal separator. */
    "decimals"?: number;
    /**
     * Which country's conventions the amount is written in, which decides the separators and where the symbol sits.
     */
    "locale"?: string;
    /** Whether negative amounts can be entered. */
    "hasSign"?: boolean;
    /** How the digits before the decimal point are grouped. Leave it out for the locale's own grouping. */
    "groupSizes"?: number[];
    /** The amount. It is the only thing that changes it. */
    "value": number | undefined;
    /** Receives the amount as it changes, which is what `v-model:value` binds. */
    "onUpdate:value"?: (value: number | undefined) => void;
};
