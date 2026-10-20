import type { Accessor, JSX } from "solid-js";

import type { BaseCornerPinValues, CornerPinGripRenderProps } from "@thewaver/ss-components";
import type { Quad } from "@thewaver/ss-utils";

import type { AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type CornerPinProps = AccessorValues<BaseCornerPinValues> & {
    /**
     * Where the content's four corners are, in shares of the box: `0` to `1` across each axis, `{ x: 0, y: 0 }` at
     * the top left. Written back as a grip is dragged, tapped somewhere new or stepped with the arrow keys, always
     * to a shape that can be drawn and within `reachRatio` of the box. `QuadWarpUtils.RESTING_CORNERS` leaves the
     * content as it is.
     */
    corners: SignalSource<Quad>;
    /**
     * Draws one grip, centered on its corner. The grip is what is pressed, dragged and tapped, so whatever it draws is
     * the target a pointer has to hit.
     */
    renderGrip: (getProps: Accessor<CornerPinGripRenderProps>) => JSX.Element;
};
