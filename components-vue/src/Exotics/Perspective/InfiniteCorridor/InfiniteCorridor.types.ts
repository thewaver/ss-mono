import type { VNodeChild } from "vue";

import type { BaseInfiniteCorridorProps, InfiniteCorridorItemState } from "@thewaver/ss-components";

export type InfiniteCorridorContentProps = {
    /**
     * Where the corridor is, `0` to `1`, one whole lap of the items; any number outside it comes round again. It is
     * the corridor's only motion, written from outside — from a scroll position, a clock or anything else — and the
     * corridor writes it back as it brings a focused item into view, the way a scrolling box scrolls to what takes
     * focus inside it, so a page driving it from a scroll position follows by scrolling there.
     */
    "progress"?: number;
    /** Receives the corridor's position as it brings a focused item into view, which is what `v-model:progress` binds. */
    "onUpdate:progress"?: (progress: number) => void;
};

export type InfiniteCorridorSlots<T> = {
    /**
     * Draws one item. It is handed how far down the corridor the item stands and whether this is a copy, so an item
     * can dim or simplify itself with distance.
     */
    renderItem: (props: { item: T; state: InfiniteCorridorItemState }) => VNodeChild;
};

export type InfiniteCorridorProps<T> = BaseInfiniteCorridorProps<T> & InfiniteCorridorContentProps;
