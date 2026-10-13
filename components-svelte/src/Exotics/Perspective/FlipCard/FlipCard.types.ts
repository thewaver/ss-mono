import type { Snippet } from "svelte";

import type { BaseFlipCardProps, FlipCardState } from "@thewaver/ss-components";

export type FlipCardProps = BaseFlipCardProps & {
    /** Which side is showing. It is the only thing that turns the card, and may be bound with `bind:flipped`. */
    flipped: boolean;
    /** Draws the front. */
    renderFront: Snippet<[state: FlipCardState]>;
    /** Draws the back. */
    renderBack: Snippet<[state: FlipCardState]>;
};
