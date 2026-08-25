import { MathUtils } from "./math.js";
import type { Point2d } from "./point2d.js";

/** The axis a swipe travels along. */
export type SwipeAxis = "horizontal" | "vertical";

/** The way a swipe travelled, once it has gone far enough to count as one. */
export type SwipeDirection = "left" | "right" | "up" | "down";

export namespace GestureUtils {
    /**
     * Finds which axis a swipe direction belongs to.
     *
     * Left and right are horizontal, up and down are vertical. Trivial, and worth a function because the
     * alternative is the same two comparisons written wherever a direction has to be turned back into the
     * axis it came from, each of them a place to get one of the four words wrong.
     *
     * @param direction The direction to classify.
     */
    export const computeSwipeAxis = (direction: SwipeDirection): SwipeAxis =>
        direction === "left" || direction === "right" ? "horizontal" : "vertical";

    /**
     * Finds how far a swipe has travelled along its axis, as a signed ratio.
     *
     * Both points are ratios of the element the gesture is happening in, so `0` is one edge and `1` is the
     * other, and the answer is in the same terms: `0.5` is half the element's width or height. Expressing it
     * that way is what lets one commit threshold mean the same thing on a phone and on a desktop.
     *
     * The off-axis coordinate is ignored rather than folded in, so a pointer wandering diagonally reports
     * only the part of its travel that counts. The sign says which way: positive is towards the far edge.
     *
     * Neither point is clamped, so a pointer dragged outside the element reports past `1` or below `0`.
     * That is deliberate — overshoot is real travel, and a caller that wants it bounded says so itself.
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
     * started. Distinguishing "nowhere" from a direction is the whole reason this returns an optional.
     *
     * The threshold is compared against the absolute travel, so it applies equally in both directions along
     * the axis. It is the caller's number rather than this function's, because how far is far enough depends
     * on what is being swiped — a photo in a carousel is not a modal being dismissed.
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
     * Finds how far to shift what is being swiped, as a ratio of `0..1`.
     *
     * Turns the signed travel of `computeSwipeProgress` into a distance in the direction the gesture is
     * committing towards, so a caller can follow the pointer with a transform without reasoning about signs.
     * Travel the other way reports `0` rather than a negative number: a modal being swiped away should not
     * slide further onto the screen when the pointer goes backwards.
     *
     * Overshoot is clamped to `1`, which is the element's own extent. Something dragged past its own size
     * has already left, and there is nothing further to show.
     *
     * @param progressRatio Signed travel along the axis, from `computeSwipeProgress`.
     * @param direction The direction the gesture is committing towards.
     */
    export const computeSwipeOffset = (progressRatio: number, direction: SwipeDirection) =>
        MathUtils.clamp01(direction === "left" || direction === "up" ? -progressRatio : progressRatio);
}
