import type { Accessor, JSX } from "solid-js";

import type { PlacementLayoutFn, PlacementRect } from "../../Abstracts/Placement/Placement.types";
import type { AccessorProps, MaybeAccessor } from "../../Utils/typeUtils";

export type FormationInset = PlacementRect;

export type FormationItemState = {
    index: number;
    itemCount: number;
    placement: PlacementRect;
};

export type FormationProps<T> = AccessorProps<{
    isStackedInReverse?: boolean;
    computeLayout: PlacementLayoutFn;
}> & {
    items: MaybeAccessor<T[]>;
    renderItem: (getItem: Accessor<T>, getState: Accessor<FormationItemState>) => JSX.Element;
};
