import { AngleUtils, MathUtils, type Point2d } from "@thewaver/ss-utils";

import type { TrailStep } from "./Trail.types";

/** Zero, as a time or a position. */
const NOTHING = 0;
/** One complete pass along the path. */
const FULL_LAP = 1;

/** Advances something traveling along a path, and works out which way it is pointing. */
export namespace TrailUtils {
    /**
     * Advances progress along the path by the time elapsed.
     *
     * @param progress How far along the path, from `0` to `1`.
     * @param elapsedMs Time since the last frame. Negative is treated as none, so a clock going
     * backwards cannot make the traveler reverse.
     * @param durationMs How long a full pass takes. Zero or less finishes at once.
     * @param isLooping Whether to start again from the beginning.
     * @returns The new progress and whether the end was reached this step — which is the signal to fire
     * a completion, whether or not the traveler then loops.
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
     * How many path lengths one run covers, for a set of travelers spaced behind the lead.
     *
     * A looping run is always one lap, since the followers simply come round behind the lead. A run that
     * stops at the end has to last until the furthest-back traveler arrives, so it is one path length plus
     * the largest offset. Offsets below zero count as zero.
     *
     * @param offsets Each traveler's distance behind the lead, as a share of the path.
     * @param isLooping Whether the run starts again from the beginning.
     * @returns `1` or more. Multiply the duration of one pass by it to keep every traveler at the speed a
     * lone one would travel.
     */
    export const getRunExtent = (offsets: readonly number[], isLooping: boolean) =>
        isLooping ? FULL_LAP : FULL_LAP + offsets.reduce((most, offset) => Math.max(most, offset), NOTHING);

    /**
     * Where one traveler is along the path, given how far the whole run has gone.
     *
     * On a looping run the traveler sits its offset behind the lead and wraps round the end, so a follower
     * is already out on the path when the run starts. A traveler with no offset is exactly the run's
     * progress, so one sent to `1` is at the end rather than wrapped back to the start. On a run that stops, it waits at the start until the
     * lead has put its offset between them, and then parks at the end once it gets there.
     *
     * @param runProgress How far the run has gone, from `0` to `1`.
     * @param offset The traveler's distance behind the lead, as a share of the path. Below zero counts as
     * zero.
     * @param extent The run's length in path lengths, from {@link getRunExtent}.
     * @param isLooping Whether the run starts again from the beginning.
     * @returns The traveler's own progress along the path, from `0` to `1`.
     */
    export const getTravelerProgress = (runProgress: number, offset: number, extent: number, isLooping: boolean) => {
        const behind = Math.max(NOTHING, offset);
        const head = MathUtils.clamp01(runProgress) * extent;

        const along = head - behind;

        if (!isLooping || (along >= NOTHING && along <= FULL_LAP)) return MathUtils.clamp01(along);

        const wrapped = along % FULL_LAP;

        return wrapped < NOTHING ? wrapped + FULL_LAP : wrapped;
    };

    /**
     * The stretch of the path to sample around a position, for working out the heading.
     *
     * Clamped at both ends, so a traveler near the start or the end takes a shorter, one-sided sample
     * rather than reading off the end of the path.
     *
     * @param length How many points the path has.
     * @param at The traveler's position among them.
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
        AngleUtils.fromRadians(Math.atan2(to.y - from.y, to.x - from.x));
}
