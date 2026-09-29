import type { InteractionFlags } from "@thewaver/ss-components-vue";

export type NumberInputStepperDirection = "up" | "down";

export type NumberInputStepperContentProps = {
    flags: InteractionFlags;
    direction: NumberInputStepperDirection;
};
