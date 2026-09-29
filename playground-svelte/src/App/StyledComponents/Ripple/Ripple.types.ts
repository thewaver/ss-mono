import type { InteractionActivation } from "@thewaver/ss-components-svelte";

export type RippleMark = InteractionActivation;

export type RippleProps = {
    activation: InteractionActivation | undefined;
    color?: string;
};
