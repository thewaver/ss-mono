import type { ReactNode } from "react";

import type {
    BaseNumberInputProps,
    InteractionFlags,
    NumberInputStepper,
    TextFieldFlags,
} from "@thewaver/ss-components";

import type { TextFieldPresetProps } from "../../../Primitives/TextField/TextField.types";

export type NumberInputProps = Omit<
    TextFieldPresetProps,
    "type" | "autoComplete" | "value" | "renderTrailing" | "onInput"
> &
    BaseNumberInputProps & {
        /** The number, and how to change it. It is the only thing that changes it. */
        value: readonly [number | undefined, (value: number | undefined) => void];
        /** Draws whatever sits after the field's text, inside the field — usually the stepper. */
        renderTrailing?: (flags: InteractionFlags<TextFieldFlags>, stepper: NumberInputStepper) => ReactNode;
    };
