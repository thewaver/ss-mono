import type { ParentProps } from "solid-js";

import type { PlacementLayout } from "../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";
import type { AccessorProps } from "../../Utils/typeUtils";

export type PlacementBoxProps = ParentProps<
    AccessorProps<{
        /** Where each item goes, as a rectangle each, worked out from how many there are. */
        layout: PlacementLayout;
    }> & {
        /** What the items do as the pointer nears them. */
        computeEffect?: ProximityEffectFn;
        /** Receives the box element once it exists, so a consumer can measure it. */
        ref?: (element: HTMLElement) => void;
    }
>;
