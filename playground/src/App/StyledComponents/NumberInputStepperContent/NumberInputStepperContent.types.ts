import type { AccessorProps, InteractionFlags } from "@thewaver/ss-components";

export type NumberInputStepperDirection = "up" | "down";

export type NumberInputStepperContentProps = AccessorProps<{
    flags: InteractionFlags;
    direction: NumberInputStepperDirection;
}>;
