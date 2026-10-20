import type { QuadCorner, Size2d } from "@thewaver/ss-utils";

export type BaseCornerHighlightValues = {
    /** The color the corner marks are drawn in. */
    color?: string;
    /** How long each corner's arms are, across and down. */
    cornerLength?: Size2d;
    /** How thick the arms are drawn. */
    strokeThickness?: number;
    /** How long the corners take to follow a change of color, which is how the set as a whole fades. */
    transitionDurationMs?: number;
    /** Which corners are drawn. One left out is not drawn at all; fading is the container's, through {@link BaseCornerHighlightValues.transitionDurationMs}. */
    visibleCorners?: Set<QuadCorner>;
};

export type BaseCornerHighlightProps = BaseCornerHighlightValues;
