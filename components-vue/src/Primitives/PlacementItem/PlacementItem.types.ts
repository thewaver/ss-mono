import type { VNodeChild } from "vue";

import type { PlacementRect } from "@thewaver/ss-components";

export type PlacementItemProps = {
    /**
     * Where this item was placed, as a share of the box rather than in pixels, so the whole arrangement scales with
     * its container. A new placement is what starts a glide, so it is compared by identity: hand over the same
     * object for as long as the item has not moved.
     */
    placement: PlacementRect;
    /** How far forward this item sits, for an arrangement whose items overlap. */
    stackAt?: number;
    /**
     * How long this item waits before gliding to a new place, when the enclosing box glides at all. Handing
     * each item a longer wait than the one before is what staggers an arrangement.
     */
    transitionDelayMs?: number;
};

export type PlacementItemSlots = {
    /** What the item holds. */
    default?: () => VNodeChild;
};
