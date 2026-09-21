import type { Size2d } from "@thewaver/ss-utils";

import type { AccessorProps } from "../../Utils/typeUtils";

export type CornerKey = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

export type CornersProps = AccessorProps<{
    /** The color the corner marks are drawn in. */
    color?: string;
    /** How long each corner's arms are, across and down. */
    cornerLength?: Size2d;
    /** How thick the arms are drawn. */
    strokeThickness?: number;
    /** How long a corner takes to fade in or out when it is turned on or off. */
    transitionDurationMs?: number;
    /** Which corners are drawn. Leaving one out fades it away rather than removing it at once. */
    visibleCorners?: Set<CornerKey>;
}>;
