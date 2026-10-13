import type { PlacementLayoutFn, PlacementRect } from "../../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../../Abstracts/Proximity/Proximity.types";

export type FormationItemState = {
    index: number;
    itemCount: number;
    placement: PlacementRect;
};

export type BaseFormationValues<T> = {
    /** Puts the first item on top of the pile instead of the last, which shows where two items overlap. */
    isStackedInReverse?: boolean;
    /**
     * How long an item takes to glide to its new place when the arrangement changes — another layout, another
     * count, another knob. `0`, the default, moves it at once. A resize of the formation never glides, since
     * nothing was rearranged, and under reduced motion every item jumps.
     */
    transitionDurationMs?: number;
    /**
     * How much later each item sets off than the one before it, so the arrangement changes as a ripple from the
     * first item to the last. Only felt while {@link BaseFormationValues.transitionDurationMs} is above `0`.
     */
    transitionDelayMs?: number;
    /**
     * The items to arrange. Each one keeps its own element for as long as it is in the list, so taking one out
     * leaves its neighbors' elements where they were rather than handing each the next one's contents. An item is
     * known by identity, so an object rebuilt on every render reads as a new item each time.
     */
    items: T[];
};

export type BaseFormationCbs = {
    /**
     * Arranges the items — a ring, an arc, a row, a honeycomb. It is asked again when the item count changes and when
     * a different function is handed over, so pass the same function for as long as the arrangement stays: one built
     * inline on every render rearranges on every render, and every item glides to where it already was.
     */
    computeLayout: PlacementLayoutFn;
    /** What the items do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
};

export type BaseFormationProps<T> = BaseFormationValues<T> & BaseFormationCbs;
