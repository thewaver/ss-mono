import type { AccessorProps, InteractionActivation } from "@thewaver/ss-components";

export type RippleMark = InteractionActivation;

export type RippleProps = AccessorProps<{
    activation: InteractionActivation | undefined;
    color?: string;
}>;
