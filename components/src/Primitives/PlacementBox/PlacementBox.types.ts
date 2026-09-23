import type { ParentProps } from "solid-js";

import type { PlacementLayout } from "../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";
import type { AccessorProps } from "../../Utils/typeUtils";

export type PlacementBoxProps = ParentProps<
    AccessorProps<{
        /** Where each item goes, as a rectangle each, worked out from how many there are. */
        layout: PlacementLayout;
        /**
         * How long an item takes to glide to its new place when the layout changes. `0`, the default, moves it at
         * once. The box resizing never glides, since nothing was rearranged, and neither does anything while the
         * user asks for reduced motion: every item jumps.
         */
        transitionDurationMs?: number;
    }> & {
        /** What the items do as the pointer nears them. */
        computeEffect?: ProximityEffectFn;
        /** Receives the box element once it exists, so a consumer can measure it. */
        ref?: (element: HTMLElement) => void;
    }
>;
