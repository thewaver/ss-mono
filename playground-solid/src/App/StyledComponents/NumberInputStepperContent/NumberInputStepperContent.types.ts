import type { AccessorProps, InteractionFlags } from "@thewaver/ss-components-solid";

export type NumberInputStepperDirection = "up" | "down";

export type NumberInputStepperContentProps = AccessorProps<{
    flags: InteractionFlags;
    direction: NumberInputStepperDirection;
}>;
