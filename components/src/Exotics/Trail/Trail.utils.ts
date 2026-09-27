import { AngleUtils, MathUtils, type Point2d } from "@thewaver/ss-utils";

import type { TrailPlace, TrailStep } from "./Trail.types";

/** Zero, as a time or a position. */
const NOTHING = 0;
/** One complete pass along the path. */
const FULL_LAP = 1;
/** Where a traveler sits before there is a path to put it on. */
const ORIGIN: Point2d = { x: 0, y: 0 };
/** How far either side of a traveler the path is sampled for its heading. */
const SAMPLE_STEP_PX = 1;

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

    /**
     * Where a traveler is on the drawn path, and which way it faces.
     *
     * @param path The path element, as drawn — its geometry is what is asked.
     * @param length The path's total length, measured once per path rather than on every frame.
     * @param progress The traveler's own progress, from {@link getTravelerProgress}.
     * @returns The progress, the point on the path in its own coordinates and the heading from {@link getAngle}.
     * Before there is a path, or while it has no length, the point is the origin and the heading is none.
     */
    export const computePlace = (path: SVGPathElement | undefined, length: number, progress: number): TrailPlace => {
        if (!path || length <= NOTHING) return { progress, point: ORIGIN, angle: NOTHING };

        const at = length * progress;
        const span = getSampleSpan(length, at, SAMPLE_STEP_PX);
        const point = path.getPointAtLength(at);

        return {
            progress,
            point: { x: point.x, y: point.y },
            angle: getAngle(path.getPointAtLength(span.from), path.getPointAtLength(span.to)),
        };
    };

    /**
     * The transform that puts a traveler's center on its place.
     *
     * The turn comes after the centering, so the element spins about its own middle rather than swinging off the
     * path on a bend.
     *
     * @param place Where the traveler is, from {@link computePlace}.
     * @param isTurning Whether it faces the way it is going, rather than staying upright.
     * @returns A `transform` value.
     */
    export const getTravelerTransform = (place: TrailPlace, isTurning: boolean) => {
        const turn = isTurning ? ` rotate(${place.angle}deg)` : "";

        return `translate(${place.point.x}px, ${place.point.y}px) translate(-50%, -50%)${turn}`;
    };

    /**
     * Walks the run forward on every animation frame until stopped, or until a run that does not loop arrives.
     *
     * Each frame reads the progress afresh, so a seek from outside between frames is carried on from rather than
     * overwritten, and steps it by {@link getSteppedProgress}.
     *
     * @param defs.getProgress The run's progress now.
     * @param defs.setProgress Writes the stepped progress.
     * @param defs.getRunDurationMs How long the whole run takes: one pass's duration times {@link getRunExtent}.
     * @param defs.getIsLooping Whether the run starts again from the beginning.
     * @param defs.onLap Runs each time the end is reached.
     * @param defs.onEnd Runs when a run that does not loop reaches the end, after `onLap`; the walking has stopped
     * by then.
     * @returns Stops the walking. It can be started again with another call.
     */
    export const run = (defs: {
        getProgress: () => number;
        setProgress: (progress: number) => void;
        getRunDurationMs: () => number;
        getIsLooping: () => boolean;
        onLap?: () => void;
        onEnd: () => void;
    }) => {
        let frameId: number | undefined;
        let lastMs = performance.now();

        const advance = () => {
            const nowMs = performance.now();
            const step = getSteppedProgress(
                defs.getProgress(),
                nowMs - lastMs,
                defs.getRunDurationMs(),
                defs.getIsLooping(),
            );

            lastMs = nowMs;
            frameId = undefined;
            defs.setProgress(step.progress);

            if (step.hasLapped) {
                defs.onLap?.();

                if (!defs.getIsLooping()) {
                    defs.onEnd();

                    return;
                }
            }

            frameId = requestAnimationFrame(advance);
        };

        frameId = requestAnimationFrame(advance);

        return () => {
            if (frameId !== undefined) cancelAnimationFrame(frameId);
        };
    };
}
