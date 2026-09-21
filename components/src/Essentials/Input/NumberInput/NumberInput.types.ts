import type { JSX } from "solid-js";

import type { InteractionFlags } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { TextFieldFlags, TextFieldPresetProps } from "../../../Primitives/TextField/TextField.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";

export type NumberInputRangeDefs = {
    min?: number;
    max?: number;
};

export type NumberInputStepDefs = NumberInputRangeDefs & {
    step: number;
};

export type NumberInputStepper = {
    getIsAtMin: () => boolean;
    getIsAtMax: () => boolean;
    stepUp: () => void;
    stepDown: () => void;
    startSteppingUp: () => void;
    startSteppingDown: () => void;
    stopStepping: () => void;
};

export type NumberInputProps = Omit<
    TextFieldPresetProps,
    "type" | "autoComplete" | "valueSignal" | "renderTrailing" | "onInput"
> &
    AccessorProps<{
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
        onInput?: (value: number | undefined) => void | Promise<void>;
    }>;
