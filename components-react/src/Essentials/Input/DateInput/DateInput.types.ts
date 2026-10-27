import type { ReactNode } from "react";

import type {
    BaseDateInputProps,
    DateValue,
    DateValueEra,
    InteractionFlags,
    TextFieldFlags,
} from "@thewaver/ss-components";

import type { TextFieldProps } from "../../../Primitives/TextField/TextField.types";

export type DateInputEra = {
    /** The id of the era the field's year is counted within. */
    value: string;
    /** Every era the calendar reports, earliest first. */
    options: DateValueEra[];
    /** Moves the field into another era, keeping the year, month and day it shows. */
    set: (next: string) => void;
};

export type DateInputProps = Omit<
    TextFieldProps,
    | "name"
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
    BaseDateInputProps & {
        /** The date, and how to change it. It is the only thing that changes it. */
        value: readonly [DateValue | undefined, (value: DateValue | undefined) => void];
        /** Draws whatever sits before the field's text, inside the field. */
        renderLeading?: (flags: InteractionFlags<TextFieldFlags>, era: DateInputEra) => ReactNode;
    };
