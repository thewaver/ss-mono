import { MathUtils, type Point2d, Point2dUtils } from "@thewaver/ss-utils";

import type { TrailStep } from "./Trail.types";

/** Zero, as a time or a position. */
const NOTHING = 0;
/** One complete pass along the path. */
const FULL_LAP = 1;

/** Advances something travelling along a path, and works out which way it is pointing. */
export namespace TrailUtils {
    /**
     * Advances progress along the path by the time elapsed.
     *
     * @param progress How far along the path, from `0` to `1`.
     * @param elapsedMs Time since the last frame. Negative is treated as none, so a clock going
     * backwards cannot make the traveller reverse.
     * @param durationMs How long a full pass takes. Zero or less finishes at once.
     * @param isLooping Whether to start again from the beginning.
     * @returns The new progress and whether the end was reached this step — which is the signal to fire
     * a completion, whether or not the traveller then loops.
     */
    export const getSteppedProgress = (
        progress: number,
        elapsedMs: number,
        durationMs: number,
        isLooping: boolean,
    ): TrailStep => {
        if (durationMs <= 0) return { progress: FULL_LAP, hasLapped: true };

        const stepped = MathUtils.clamp01(progress) + Math.max(NOTHING, elapsedMs) / durationMs;

        if (stepped < FULL_LAP) return { progress: stepped, hasLapped: false };
        if (!isLooping) return { progress: FULL_LAP, hasLapped: true };

        return { progress: stepped % FULL_LAP, hasLapped: true };
    };

    /**
     * The stretch of the path to sample around a position, for working out the heading.
     *
     * Clamped at both ends, so a traveller near the start or the end takes a shorter, one-sided sample
     * rather than reading off the end of the path.
     *
     * @param length How many points the path has.
     * @param at The traveller's position among them.
     * @param step How far either side to look. A wider sample gives a steadier heading on a rough path
     * and a laggier one on a sharp corner.
     */
    export const getSampleSpan = (length: number, at: number, step: number) => ({
        from: Math.max(NOTHING, at - step),
        to: Math.min(length, at + step),
    });

    /**
     * The heading from one point to another.
     *
     * @returns Degrees, zero pointing right and increasing clockwise — ready to put straight into a
     * rotation.
     */
    export const getAngle = (from: Point2d, to: Point2d) =>
        Point2dUtils.radiansToDegrees(Math.atan2(to.y - from.y, to.x - from.x));
}
