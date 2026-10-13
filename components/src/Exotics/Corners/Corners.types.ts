import type { Size2d } from "@thewaver/ss-utils";

export type CornerKey = "top_left" | "top_right" | "bottom_left" | "bottom_right";

export type BaseCornersValues = {
    /** The color the corner marks are drawn in. */
    color?: string;
    /** How long each corner's arms are, across and down. */
    cornerLength?: Size2d;
    /** How thick the arms are drawn. */
    strokeThickness?: number;
    /** How long the corners take to follow a change of color, which is how the set as a whole fades. */
    transitionDurationMs?: number;
    /** Which corners are drawn. One left out is not drawn at all; fading is the container's, through {@link BaseCornersValues.transitionDurationMs}. */
    visibleCorners?: Set<CornerKey>;
};

export type BaseCornersProps = BaseCornersValues;
