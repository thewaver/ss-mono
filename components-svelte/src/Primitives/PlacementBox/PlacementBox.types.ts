import type { Snippet } from "svelte";

import type { PlacementLayout, PointSource, ProximityEffectFn } from "@thewaver/ss-components";

export type PlacementBoxProps = {
    /** Where each item goes, as a rectangle each, worked out from how many there are. */
    layout: PlacementLayout;
    /**
     * How long an item takes to glide to its new place when the layout changes. `0`, the default, moves it at
     * once. The box resizing never glides, since nothing was rearranged, and neither does anything while the
     * user asks for reduced motion: every item jumps.
     */
    transitionDurationMs?: number;
    /**
     * The point to follow instead of the pointer.
     *
     * A fraction across a box — the box's own, or the element named in the source — so a light moving
     * across a banner can be handed to every card under it and each answers to the same spot. While the source has
     * no point every item rests, as it does when the pointer leaves the window. Left out, the pointer is
     * followed.
     */
    pointSource?: PointSource;
    /** What the items do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /**
     * The box element, so a consumer can measure it. Bind it with `bind:ref`; it reads `undefined` until the element
     * exists and again once it is gone.
     */
    ref?: HTMLElement;
    /** The items, each a `PlacementItem`. */
    children?: Snippet;
};
