import type { Point2d } from "@thewaver/ss-utils";

import type { PlacementLayout } from "../../Abstracts/Placement/Placement.types";
import { PlacementUtils } from "../../Abstracts/Placement/Placement.utils";
import type { ProximityArrangement } from "../../Abstracts/Proximity/Proximity.types";
import { ProximityUtils } from "../../Abstracts/Proximity/Proximity.utils";
import type { PlacementBoxContextType } from "./PlacementBox.context.types";

const NO_OVERREACH = 0;
const NO_TRANSITION_MS = 0;

/**
 * What a `PlacementBox` works out from the pointer and its own settings, and hands down to every item in it.
 *
 * The box tracks the pointer only while it has an effect to drive, and asks about reduced motion only while it has
 * something that moves. Every function here is one step of that, taken on its own so a view can recompute each one
 * only when what it reads changes.
 */
export namespace PlacementBoxUtils {
    /**
     * What an item reads when there is no box above it.
     *
     * No pointer, a resting arrangement, no effect and no gliding, so an item rendered on its own stands still rather
     * than failing. A consumer building their own item should treat it as the "no box above me" case.
     */
    export const UNTRACKED_CONTEXT: PlacementBoxContextType = {
        getPointerPoint: () => undefined,
        getArrangement: () => ProximityUtils.RESTING_ARRANGEMENT,
        getOverreach: () => NO_OVERREACH,
        getPrefersReducedMotion: () => false,
        getComputeEffect: () => undefined,
        getTransitionDurationMs: () => NO_TRANSITION_MS,
    };

    /**
     * Whether the box needs to know if the user has asked for reduced motion.
     *
     * The answer only changes something when the box has an effect, which is told about the request, or a glide,
     * which the request switches off. With neither, the query is not listened to at all.
     *
     * @param hasEffect Whether the box was given an effect.
     * @param transitionDurationMs The glide the box was given.
     */
    export const getIsMotionQueryNeeded = (hasEffect: boolean, transitionDurationMs: number) =>
        hasEffect || transitionDurationMs > NO_TRANSITION_MS;

    /**
     * Where the pointer is, in the layout's own coordinates, for as long as it counts.
     *
     * @param layout The box's arrangement.
     * @param boxRatio Where the pointer sits over the box, `0` to `1` on each axis.
     * @param isPointerPresent Whether the pointer is over the window at all.
     * @param hasEffect Whether the box was given an effect. Without one the pointer is never tracked.
     * @returns The point, or `undefined` when there is no effect, no pointer, or the pointer is out of the layout's
     * reach — see {@link PlacementUtils.getIsWithinReach}.
     */
    export const computePointerPoint = (
        layout: PlacementLayout,
        boxRatio: Point2d,
        isPointerPresent: boolean,
        hasEffect: boolean,
    ): Point2d | undefined => {
        if (!hasEffect || !isPointerPresent) return undefined;

        const point = PlacementUtils.toLayoutPoint(boxRatio, layout.heightRatio);

        return PlacementUtils.getIsWithinReach(layout, point) ? point : undefined;
    };

    /**
     * What the run is like, for the effect to measure an item against.
     *
     * @param layout The box's arrangement.
     * @param hasEffect Whether the box was given an effect.
     * @returns {@link ProximityUtils.toArrangement} of the layout, or {@link ProximityUtils.RESTING_ARRANGEMENT}
     * without an effect, since nothing would read it.
     */
    export const computeArrangement = (layout: PlacementLayout, hasEffect: boolean): ProximityArrangement =>
        hasEffect ? ProximityUtils.toArrangement(layout) : ProximityUtils.RESTING_ARRANGEMENT;

    /**
     * How far past the run's own span the pointer sits, shared by every item in it.
     *
     * @param layout The box's arrangement.
     * @param point The pointer, from {@link computePointerPoint}.
     * @returns {@link PlacementUtils.getRunOverreach}, or `0` when there is no pointer.
     */
    export const computeOverreach = (layout: PlacementLayout, point: Point2d | undefined) =>
        point === undefined ? NO_OVERREACH : PlacementUtils.getRunOverreach(layout, point);

    /**
     * How long the items take to glide, once the user's motion preference is applied.
     *
     * @param transitionDurationMs The glide the box was given.
     * @param prefersReducedMotion Whether the user has asked for reduced motion.
     * @returns The glide, or `0` while motion is reduced, so every item jumps.
     */
    export const computeTransitionDurationMs = (transitionDurationMs: number, prefersReducedMotion: boolean) =>
        prefersReducedMotion ? NO_TRANSITION_MS : transitionDurationMs;
}
