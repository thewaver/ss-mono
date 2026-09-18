import type { Accessor, JSX } from "solid-js";

import type { PlacementLayoutFn, PlacementRect } from "../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";
import type { AccessorProps, MaybeAccessor } from "../../Utils/typeUtils";

export type FormationInset = PlacementRect;

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
}> & {
    /** The items to arrange. */
    items: MaybeAccessor<T[]>;
    /** Draws one item, and is told where it was placed. */
    renderItem: (getItem: Accessor<T>, getState: Accessor<FormationItemState>) => JSX.Element;
};
