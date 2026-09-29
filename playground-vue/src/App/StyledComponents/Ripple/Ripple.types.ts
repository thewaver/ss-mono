import type { InteractionActivation } from "@thewaver/ss-components-vue";

export type RippleMark = InteractionActivation;

export type RippleProps = {
    activation: InteractionActivation | undefined;
    color?: string;
};
