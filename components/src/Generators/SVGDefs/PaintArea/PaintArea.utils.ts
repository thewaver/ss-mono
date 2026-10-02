import type { Rect } from "@thewaver/ss-utils";

import type { PaintAreaClipPathAttributes } from "./PaintArea.types";

/**
 * Lays paint written in fractions of a box across a paint area instead of across the element it paints.
 *
 * Gradients and clip paths here are written in fractions — `0` to `1` across and down — and by default those
 * fractions are of whatever element the paint lands on. Several separate elements meant to read as one picture,
 * such as the letters of a running `Typewriter` or the cells of a board, each need the fractions to mean the same
 * shared area instead, shifted to where each element sits. These turn an area into the attributes that do that.
 */
export namespace PaintAreaUtils {
    /**
     * The transform that stretches fractions over an area.
     *
     * @param area The box, in the coordinates of the elements being painted.
     * @returns `translate(x y) scale(width height)`, or `undefined` when there is no area or it has no width or no
     * height yet, so a caller can fall back to the element's own box rather than collapse the paint to nothing.
     */
    export const computeTransform = (area: Rect | undefined) =>
        area?.width && area.height ? `translate(${area.x} ${area.y}) scale(${area.width} ${area.height})` : undefined;

    /**
     * The attributes that lay a clip path written in fractions across an area.
     *
     * @param area The box the clip is laid across; without one, the clip follows each element's own box as before.
     * @returns `clipPathUnits` and `transform` for the `clipPath` element.
     */
    export const computeClipPathAttributes = (area: Rect | undefined): PaintAreaClipPathAttributes => {
        const transform = computeTransform(area);

        return transform
            ? { clipPathUnits: "userSpaceOnUse", transform }
            : { clipPathUnits: "objectBoundingBox", transform: undefined };
    };
}
