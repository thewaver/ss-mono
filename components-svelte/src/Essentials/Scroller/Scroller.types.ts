import type { Snippet } from "svelte";

import type { BaseScrollerProps, ScrollerStep, ScrollerStepper } from "@thewaver/ss-components";

export type ScrollerProps = BaseScrollerProps & {
    /**
     * How far through its run the strip is scrolled, from 0 to 1. Bind it with `bind:progress` to drive or follow it:
     * the strip writes its position as it moves, and a value written from outside scrolls it there. Left unbound, the
     * strip keeps its own.
     */
    progress?: number;
    /** Draws one scroll control, and is handed a stepper for holding it down to keep scrolling. */
    renderButton: Snippet<[step: ScrollerStep, stepper: ScrollerStepper]>;
    /** The run of items the strip scrolls. They are rendered as they are, inside the track. */
    children?: Snippet;
};
