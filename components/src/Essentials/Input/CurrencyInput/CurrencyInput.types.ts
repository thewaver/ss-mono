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
        decimals?: number;
        locale?: string;
        hasSign?: boolean;
        valueSignal: SignalSource<number | undefined>;
    }> & {
        groupSizes?: MaybeAccessor<number[] | undefined>;
    };
