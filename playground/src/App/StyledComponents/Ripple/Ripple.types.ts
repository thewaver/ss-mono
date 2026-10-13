import type { InteractionActivation } from "@thewaver/ss-components";

export type RippleMark = InteractionActivation;

export type BaseRippleValues = {
    activation: InteractionActivation | undefined;
    color?: string;
};

export type BaseRippleProps = BaseRippleValues;
