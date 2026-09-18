import type { ParentProps } from "solid-js";

import type { PlacementRect } from "../../Abstracts/Placement/Placement.types";
import type { AccessorProps } from "../../Utils/typeUtils";

export type PlacementItemProps = ParentProps<
    AccessorProps<{
        /**
         * Where this item was placed, as a share of the box rather than in pixels, so the whole arrangement scales with
         * its container.
         */
        placement: PlacementRect;
        /** How far forward this item sits, for an arrangement whose items overlap. */
        stackAt?: number;
    }>
>;
