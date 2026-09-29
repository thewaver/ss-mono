import type { InteractionActivation } from "@thewaver/ss-components-react";

export type RippleMark = InteractionActivation;

export type RippleProps = {
    activation: InteractionActivation | undefined;
    color?: string;
};
