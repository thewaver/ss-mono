import type { VNodeChild } from "vue";

import type { PlacementLayout, ProximityEffectFn } from "@thewaver/ss-components";

export type PlacementBoxProps = {
    /** Where each item goes, as a rectangle each, worked out from how many there are. */
    layout: PlacementLayout;
    /**
     * How long an item takes to glide to its new place when the layout changes. `0`, the default, moves it at
     * once. The box resizing never glides, since nothing was rearranged, and neither does anything while the
     * user asks for reduced motion: every item jumps.
     */
    transitionDurationMs?: number;
    /** What the items do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
};

export type PlacementBoxSlots = {
    /** The items, each a `PlacementItem`. */
    default?: () => VNodeChild;
};
