import type { ReactNode } from "react";

import type { BaseCornerPinValues, CornerPinGripRenderProps, QuadWarpCorners } from "@thewaver/ss-components";

export type CornerPinProps = BaseCornerPinValues & {
    /**
     * Where the content's four corners are, in shares of the box: `0` to `1` across each axis, `{ x: 0, y: 0 }` at
     * the top left. Written back as a grip is dragged, tapped somewhere new or stepped with the arrow keys, always
     * to a shape that can be drawn and within `reachRatio` of the box. `QuadWarpUtils.RESTING_CORNERS` leaves the
     * content as it is.
     */
    corners: readonly [QuadWarpCorners, (value: QuadWarpCorners) => void];
    /**
     * Draws one grip, centered on its corner. The grip is what is pressed, dragged and tapped, so whatever it draws is
     * the target a pointer has to hit.
     */
    renderGrip: (props: CornerPinGripRenderProps) => ReactNode;
    /** The content that is stretched to the four corners. */
    children?: ReactNode;
};
