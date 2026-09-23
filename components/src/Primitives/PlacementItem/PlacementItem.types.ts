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
        /**
         * How long this item waits before gliding to a new place, when the enclosing box glides at all. Handing
         * each item a longer wait than the one before is what staggers an arrangement.
         */
        transitionDelayMs?: number;
    }>
>;
