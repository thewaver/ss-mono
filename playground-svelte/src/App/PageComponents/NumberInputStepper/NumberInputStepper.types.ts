import type { InteractionFlags, NumberInputStepper, TextFieldFlags } from "@thewaver/ss-components-svelte";

export type NumberInputStepperProps = {
    flags: InteractionFlags<TextFieldFlags>;
    stepper: NumberInputStepper;
};
