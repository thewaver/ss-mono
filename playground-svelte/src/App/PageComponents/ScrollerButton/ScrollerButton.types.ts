import type { ScrollerAxis, ScrollerStep, ScrollerStepper } from "@thewaver/ss-components-svelte";

export type ScrollerButtonProps = {
    step: ScrollerStep;
    axis?: ScrollerAxis;
    stepper: ScrollerStepper;
};
