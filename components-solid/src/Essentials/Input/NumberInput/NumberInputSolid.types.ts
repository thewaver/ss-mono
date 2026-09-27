import type { JSX } from "solid-js";

import type { InteractionFlags, NumberInputStepper, TextFieldFlags } from "@thewaver/ss-components";

import type { TextFieldPresetProps } from "../../../Primitives/TextField/TextFieldSolid.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";

export type NumberInputProps = Omit<
    TextFieldPresetProps,
    "type" | "autoComplete" | "valueSignal" | "renderTrailing" | "onInput"
> &
    AccessorProps<{
        /**
         * How far PageUp and PageDown move the number. Left out, ten times `step`. It is held to the bounds and lands
         * on a step, as the arrows do.
         */
        pageStep?: number;
        /**
         * Which country's conventions the number is read and written in, which decides the character that marks the
         * fraction and the one that groups thousands. Under a German locale `1.000` reads as one thousand and `1,5` as
         * one and a half. The field writes the number back with the locale's decimal separator and without grouping.
         * Left out, the reader's own.
         */
        locale?: string;
        /** How long a stepper button has to be held before it starts repeating. */
        repeatDelayMs?: number;
        /** How often it repeats once it has started. */
        repeatIntervalMs?: number;
        /** The number. It is the only thing that changes it. */
        valueSignal: SignalSource<number | undefined>;
        /** Draws whatever sits after the field's text, inside the field — usually the stepper. */
        renderTrailing?: (getFlags: () => InteractionFlags<TextFieldFlags>, stepper: NumberInputStepper) => JSX.Element;
        /**
         * Runs as the number changes. It answers with nothing while the field is empty, which is what separates empty
         * from zero.
         */
        onInput?: (value: number | undefined) => void;
    }>;
