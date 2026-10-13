import type { VNodeChild } from "vue";

import type { BaseFlipCardProps, FlipCardState } from "@thewaver/ss-components";

export type FlipCardProps = BaseFlipCardProps & {
    /** Which side is showing. It is the only thing that turns the card. */
    "flipped": boolean;
    /** Receives a change of side, which is what `v-model:flipped` binds. */
    "onUpdate:flipped"?: (isFlipped: boolean) => void;
};

export type FlipCardSlots = {
    /** Draws the front. */
    renderFront: (state: FlipCardState) => VNodeChild;
    /** Draws the back. */
    renderBack: (state: FlipCardState) => VNodeChild;
};
