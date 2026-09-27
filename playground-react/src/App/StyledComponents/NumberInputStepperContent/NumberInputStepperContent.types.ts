import type { InteractionFlags } from "@thewaver/ss-components-react";

export type NumberInputStepperDirection = "up" | "down";

export type NumberInputStepperContentProps = {
    flags: InteractionFlags;
    direction: NumberInputStepperDirection;
};
