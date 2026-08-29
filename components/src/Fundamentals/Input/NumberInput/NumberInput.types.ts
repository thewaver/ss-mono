import type { JSX } from "solid-js";

import type { InteractionFlags } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { MaybeAccessor, SignalSource } from "../../../Utils/typeUtils";
import type { TextFieldFlags, TextFieldPresetProps } from "../TextField/TextField.types";

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
> & {
    repeatDelayMs?: MaybeAccessor<number>;
    repeatIntervalMs?: MaybeAccessor<number>;
    valueSignal: SignalSource<number | undefined>;
    renderTrailing?: (getFlags: () => InteractionFlags<TextFieldFlags>, stepper: NumberInputStepper) => JSX.Element;
    onInput?: (value: number | undefined) => void | Promise<void>;
};
