import { MathUtils } from "@thewaver/ss-utils";

import type { CellAnimationPlaybackDirection, CellAnimationPlaybackOpts } from "./CellAnimationPlayback.types";

const DEFAULT_DIRECTION: CellAnimationPlaybackDirection = "normal";
const DEFAULT_HOLD_MS = 0;
const isAlternating = (dir: CellAnimationPlaybackDirection) => dir === "alternate" || dir === "alternate-reverse";
const computeAlternated = (progress: number, outward: number) => {
    if (outward <= 0) return 1;
    if (progress < outward) return progress / outward;
    if (progress < 1 - outward) return 1;

    return (1 - progress) / outward;
};

/**
 * Turns elapsed time into the position on a cell animation's timeline, for a playback that loops.
 *
 * A cell animation is handed a timeline from `0` to `1` and knows nothing about time. These add the part that
 * does: running it forwards or backwards, and — for the alternating directions — out and back again with an
 * optional hold at the turn, so a loop can breathe rather than snapping from its end to its start.
 */
export namespace CellAnimationPlaybackUtils {
    /**
     * How long one full loop takes.
     *
     * A one-way pass, forwards or backwards, takes the duration it was given. An alternating pass makes both trips
     * and waits at the turn, so it takes twice the duration plus the hold. A negative hold counts as none.
     *
     * @param durationMs How long one trip takes.
     * @param opts The direction — `normal` if left out — and the hold at the turn.
     * @returns The length of one loop, in milliseconds.
     */
    export const computeCycleDurationMs = (durationMs: number, opts?: CellAnimationPlaybackOpts) => {
        if (!isAlternating(opts?.dir ?? DEFAULT_DIRECTION)) return durationMs;

        return durationMs * 2 + Math.max(opts?.holdMs ?? DEFAULT_HOLD_MS, 0);
    };

    /**
     * Where the animation's own timeline is, at a point through one loop.
     *
     * Forwards is the loop's progress as it is and backwards is its mirror. An alternating loop spends its first
     * stretch going out, holds at the end for the hold, and spends the last stretch coming back, each trip taking
     * the share of the loop its duration is; the reverse alternation does the same starting from the far end.
     *
     * @param timeline How far through the loop playback is, from `0` to `1`; values outside are clamped.
     * @param durationMs How long one trip takes, which decides how much of the loop the hold takes up.
     * @param opts The direction and the hold at the turn.
     * @returns The position to hand the animation, from `0` to `1`.
     */
    export const computeGlobalTimeline = (timeline: number, durationMs: number, opts?: CellAnimationPlaybackOpts) => {
        const dir = opts?.dir ?? DEFAULT_DIRECTION;
        const progress = MathUtils.clamp01(timeline);

        if (!isAlternating(dir)) return dir === "reverse" ? 1 - progress : progress;

        const cycleMs = computeCycleDurationMs(durationMs, opts);
        const outward = cycleMs > 0 ? MathUtils.clamp01(durationMs / cycleMs) : 0;
        const alternated = computeAlternated(progress, outward);

        return dir === "alternate-reverse" ? 1 - alternated : alternated;
    };
}
