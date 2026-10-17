import type { VNodeChild } from "vue";

import type { BaseCornerPinProps, CornerPinGripRenderProps, QuadWarpCorners } from "@thewaver/ss-components";

export type CornerPinContentProps = {
    /**
     * Where the content's four corners are, in shares of the box: `0` to `1` across each axis, `{ x: 0, y: 0 }` at
     * the top left. Written back as a grip is dragged, tapped somewhere new or stepped with the arrow keys, always
     * to a shape that can be drawn and within `reachRatio` of the box. `QuadWarpUtils.RESTING_CORNERS` leaves the
     * content as it is.
     */
    "corners": QuadWarpCorners;
    /** Receives the corners as they change, which is what `v-model:corners` binds. */
    "onUpdate:corners"?: (corners: QuadWarpCorners) => void;
};

export type CornerPinSlots = {
    /**
     * Draws one grip, centered on its corner. The grip is what is pressed, dragged and tapped, so whatever it draws is
     * the target a pointer has to hit.
     */
    renderGrip: (props: CornerPinGripRenderProps) => VNodeChild;
    /** The content that is stretched to the four corners. */
    default?: () => VNodeChild;
};

export type CornerPinProps = BaseCornerPinProps & CornerPinContentProps;
