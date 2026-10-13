import type { VNodeChild } from "vue";

import type {
    BaseNumberInputProps,
    InteractionFlags,
    NumberInputStepper,
    TextFieldFlags,
} from "@thewaver/ss-components";

import type { TextFieldPresetProps, TextFieldSlots } from "../../../Primitives/TextField/TextField.types";

export type NumberInputProps = Omit<
    TextFieldPresetProps,
    "type" | "autoComplete" | "value" | "onUpdate:value" | "onInput"
> &
    BaseNumberInputProps & {
        /** The number. It is the only thing that changes it. */
        "value": number | undefined;
        /** Receives the number as it changes, which is what `v-model:value` binds. */
        "onUpdate:value"?: (value: number | undefined) => void;
    };

export type NumberInputSlots = Omit<TextFieldSlots, "renderTrailing"> & {
    /** Draws whatever sits after the field's text, inside the field — usually the stepper. */
    renderTrailing?: (props: { flags: InteractionFlags<TextFieldFlags>; stepper: NumberInputStepper }) => VNodeChild;
};
