import { MathUtils } from "./math.js";
import type { Point2d } from "./point2d.js";

/** The axis a swipe travels along. */
export type SwipeAxis = "horizontal" | "vertical";

/** The way a swipe traveled, once it has gone far enough to count as one. */
export type SwipeDirection = "left" | "right" | "up" | "down";

export namespace GestureUtils {
    /**
     * Finds which axis a swipe direction belongs to.
     *
     * Left and right are horizontal, up and down are vertical.
     *
     * @param direction The direction to classify.
     */
    export const computeSwipeAxis = (direction: SwipeDirection): SwipeAxis =>
        direction === "left" || direction === "right" ? "horizontal" : "vertical";

    /**
     * Finds how far a swipe has traveled along its axis, as a signed ratio.
     *
     * Both points are ratios of the element the gesture is happening in, so `0` is one edge and `1` is the
     * other, and the answer is in the same terms: `0.5` is half the element's width or height. One commit
     * threshold therefore means the same thing on a phone and on a desktop.
     *
     * The off-axis coordinate takes no part, so a pointer wandering diagonally reports only its travel along
     * the axis. The sign says which way: positive is towards the far edge.
     *
     * Neither point is clamped, so a pointer dragged outside the element reports past `1` or below `0`. A
     * caller wanting it bounded clamps it itself.
     *
     * @param origin Where the gesture started, as a ratio of the element.
     * @param current Where the pointer is now, as a ratio of the element.
     * @param axis Which axis to measure along.
     */
    export const computeSwipeProgress = (origin: Point2d, current: Point2d, axis: SwipeAxis) =>
        axis === "horizontal" ? current.x - origin.x : current.y - origin.y;

    /**
     * Decides which way a swipe committed, or that it did not commit at all.
     *
     * A gesture that ends short of `commitRatio` reports `undefined` rather than a direction: the pointer
     * moved, but not enough to mean anything, and the caller should put whatever it was moving back where it
     * started.
     *
     * The threshold is compared against the absolute travel, so it applies equally in both directions along
     * the axis.
     *
     * @param progressRatio Signed travel along the axis, from `computeSwipeProgress`.
     * @param axis Which axis the gesture is on.
     * @param commitRatio How far it must travel to count, as a ratio of the element.
     */
    export const computeSwipeDirection = (
        progressRatio: number,
        axis: SwipeAxis,
        commitRatio: number,
    ): SwipeDirection | undefined => {
        if (Math.abs(progressRatio) < commitRatio) return undefined;

        if (axis === "horizontal") return progressRatio > 0 ? "right" : "left";

        return progressRatio > 0 ? "down" : "up";
    };

    /**
     * Finds which axis a two-axis gesture has traveled furthest along.
     *
     * A swipe free to go any of the four ways still commits to one of them, so something has to reduce a
     * diagonal to a single axis. An exact diagonal resolves horizontally, which is arbitrary and only has
     * to be consistent.
     *
     * @param progress Signed travel along each axis, from {@link computeSwipeProgress} run once per axis.
     */
    export const computeTravelAxis = (progress: Point2d): SwipeAxis =>
        Math.abs(progress.x) >= Math.abs(progress.y) ? "horizontal" : "vertical";

    /**
     * Decides which of the four ways a swipe committed when both axes are live, or that it did not commit.
     *
     * Only the axis it traveled furthest along is measured against `commitRatio`, so a drag mostly rightwards
     * and a little downwards commits to `right` rather than to both or to neither. The other axis takes no
     * part once the dominant one is chosen.
     *
     * @param progress Signed travel along each axis, from {@link computeSwipeProgress} run once per axis.
     * @param commitRatio How far it must travel to count, as a ratio of the element.
     */
    export const computeFreeSwipeDirection = (progress: Point2d, commitRatio: number) => {
        const axis = computeTravelAxis(progress);

        return computeSwipeDirection(axis === "horizontal" ? progress.x : progress.y, axis, commitRatio);
    };

    /**
     * Finds how far to shift what is being swiped, as a ratio of `0..1`.
     *
     * Turns the signed travel of `computeSwipeProgress` into a distance in the direction the gesture is
     * committing towards, so a caller can follow the pointer with a transform without reasoning about signs.
     * Travel the other way reports `0` rather than a negative number.
     *
     * Overshoot is clamped to `1`, which is the element's own extent.
     *
     * @param progressRatio Signed travel along the axis, from `computeSwipeProgress`.
     * @param direction The direction the gesture is committing towards.
     */
    export const computeSwipeOffset = (progressRatio: number, direction: SwipeDirection) =>
        MathUtils.clamp01(direction === "left" || direction === "up" ? -progressRatio : progressRatio);
}
