import type { Snippet } from "svelte";

import type { FormationItemState, PlacementLayoutFn, ProximityEffectFn } from "@thewaver/ss-components";

export type FormationProps<T> = {
    /** Puts the first item on top of the pile instead of the last, which shows where two items overlap. */
    isStackedInReverse?: boolean;
    /**
     * Arranges the items — a ring, an arc, a row, a honeycomb. It is asked again when the item count changes and when
     * a different function is handed over, so pass the same function for as long as the arrangement stays: one built
     * afresh on every update rearranges on every update, and every item glides to where it already was.
     */
    computeLayout: PlacementLayoutFn;
    /** What the items do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /**
     * How long an item takes to glide to its new place when the arrangement changes — another layout, another
     * count, another knob. `0`, the default, moves it at once. A resize of the formation never glides, since
     * nothing was rearranged, and under reduced motion every item jumps.
     */
    transitionDurationMs?: number;
    /**
     * How much later each item sets off than the one before it, so the arrangement changes as a ripple from the
     * first item to the last. Only felt while {@link FormationProps.transitionDurationMs} is above `0`.
     */
    transitionDelayMs?: number;
    /**
     * The items to arrange. Each one keeps its own element for as long as it is in the list, so taking one out
     * leaves its neighbors' elements where they were rather than handing each the next one's contents. An item is
     * known by identity, so an object rebuilt on every update reads as a new item each time.
     */
    items: T[];
    /** Draws one item, and is told where it was placed. */
    renderItem: Snippet<[item: T, state: FormationItemState]>;
};
