import type { TextFieldProps } from "../../../Primitives/TextField/TextField.types";
import type { AccessorProps, MaybeAccessor, SignalSource } from "../../../Utils/typeUtils";

export type CurrencyInputProps = Omit<
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
    | "step"
    | "onInput"
    | "onBlur"
> &
    AccessorProps<{
        /** How many digits are kept after the decimal separator. */
        decimals?: number;
        /**
         * Which country's conventions the amount is written in, which decides the separators and where the symbol sits.
         */
        locale?: string;
        /** Whether negative amounts can be entered. */
        hasSign?: boolean;
        /** The amount. It is the only thing that changes it. */
        valueSignal: SignalSource<number | undefined>;
    }> & {
        /** How the digits before the decimal point are grouped. Leave it out for the locale's own grouping. */
        groupSizes?: MaybeAccessor<number[] | undefined>;
    };
