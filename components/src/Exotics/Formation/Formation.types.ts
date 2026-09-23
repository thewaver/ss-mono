import type { Accessor, JSX } from "solid-js";

import type { PlacementLayoutFn, PlacementRect } from "../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";
import type { AccessorProps, MaybeAccessor } from "../../Utils/typeUtils";

export type FormationItemState = {
    index: number;
    itemCount: number;
    placement: PlacementRect;
};

export type FormationProps<T> = AccessorProps<{
    /** Puts the first item on top of the pile instead of the last, which shows where two items overlap. */
    isStackedInReverse?: boolean;
    /** Arranges the items — a ring, an arc, a row, a honeycomb. */
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
    staggerMs?: number;
}> & {
    /**
     * The items to arrange. Each one keeps its own element for as long as it is in the list, so taking one out
     * leaves its neighbors' elements where they were rather than handing each the next one's contents.
     */
    items: MaybeAccessor<T[]>;
    /** Draws one item, and is told where it was placed. */
    renderItem: (getItem: Accessor<T>, getState: Accessor<FormationItemState>) => JSX.Element;
};
