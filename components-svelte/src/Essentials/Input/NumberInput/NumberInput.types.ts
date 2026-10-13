import type { Snippet } from "svelte";

import type {
    BaseNumberInputProps,
    InteractionFlags,
    NumberInputStepper,
    TextFieldFlags,
} from "@thewaver/ss-components";

import type { TextFieldPresetProps } from "../../../Primitives/TextField/TextField.types.js";

export type NumberInputProps = Omit<
    TextFieldPresetProps,
    "type" | "autoComplete" | "value" | "renderTrailing" | "onInput"
> &
    BaseNumberInputProps & {
        /**
         * The number. Bind it with `bind:value`; it is the only thing that changes it. It reads `undefined` while the
         * field is empty.
         */
        value: number | undefined;
        /** Draws whatever sits after the field's text, inside the field — usually the stepper. */
        renderTrailing?: Snippet<[flags: InteractionFlags<TextFieldFlags>, stepper: NumberInputStepper]>;
    };
