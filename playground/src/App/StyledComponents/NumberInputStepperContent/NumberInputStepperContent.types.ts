import type { InteractionFlags } from "@thewaver/ss-components";

export type NumberInputStepperDirection = "up" | "down";

export type BaseNumberInputStepperContentValues = {
    flags: InteractionFlags;
    direction: NumberInputStepperDirection;
};

export type BaseNumberInputStepperContentProps = BaseNumberInputStepperContentValues;
