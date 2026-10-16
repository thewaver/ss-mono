import type { Snippet } from "svelte";

import type { BaseInfiniteCorridorProps, InfiniteCorridorItemState } from "@thewaver/ss-components";

export type InfiniteCorridorProps<T> = BaseInfiniteCorridorProps<T> & {
    /**
     * Where the corridor is, `0` to `1`, one whole lap of the items; any number outside it comes round again. It is
     * the corridor's only motion, written from outside — from a scroll position, a clock or anything else — and the
     * corridor writes it back as it brings a focused item into view, the way a scrolling box scrolls to what takes
     * focus inside it, so a page driving it from a scroll position follows by scrolling there. Bind it with
     * `bind:progress` to drive or follow it; left unbound, the corridor keeps its own, starting at `0`.
     */
    progress?: number;
    /**
     * Draws one item. It is handed how far down the corridor the item stands and whether this is a copy, so an item
     * can dim or simplify itself with distance.
     */
    renderItem: Snippet<[item: T, state: InfiniteCorridorItemState]>;
};
