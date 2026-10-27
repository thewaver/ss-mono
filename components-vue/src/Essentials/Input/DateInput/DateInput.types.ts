import type { VNodeChild } from "vue";

import type {
    BaseDateInputProps,
    DateValue,
    DateValueEra,
    InteractionFlags,
    TextFieldFlags,
} from "@thewaver/ss-components";

import type { TextFieldProps, TextFieldSlots } from "../../../Primitives/TextField/TextField.types";

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
    | "min"
    | "max"
    | "step"
    | "onInput"
    | "onBlur"
> &
    BaseDateInputProps & {
        /** The date, which is what `v-model:value` binds. It is the only thing that changes it. */
        "value": DateValue | undefined;
        /** Receives the date once what is typed makes a whole one, and `undefined` once the field is emptied. */
        "onUpdate:value"?: (value: DateValue | undefined) => void;
    };

export type DateInputSlots = Omit<TextFieldSlots, "renderLeading"> & {
    /** Draws whatever sits before the field's text, inside the field, and is handed the era the year counts within. */
    renderLeading?: (props: { flags: InteractionFlags<TextFieldFlags>; era: DateInputEra }) => VNodeChild;
};
