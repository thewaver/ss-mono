import type { ParentProps } from "solid-js";

import type { PlacementLayout } from "../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";
import type { AccessorProps } from "../../Utils/typeUtils";

export type PlacementBoxProps = ParentProps<
    AccessorProps<{
        layout: PlacementLayout;
    }> & {
        computeEffect?: ProximityEffectFn;
        ref?: (element: HTMLElement) => void;
    }
>;
