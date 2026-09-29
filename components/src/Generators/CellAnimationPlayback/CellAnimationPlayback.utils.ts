import { MathUtils } from "@thewaver/ss-utils";

import type { CellAnimationBreakpointOpts } from "../CellAnimationBreakpoints/CellAnimationBreakpoints.types";
import type { CellAnimationPlaybackDirection, CellAnimationPlaybackOpts } from "./CellAnimationPlayback.types";

const DEFAULT_DIRECTION: CellAnimationPlaybackDirection = "normal";
const DEFAULT_HOLD_MS = 0;
const ROUND_TRIPS: readonly CellAnimationPlaybackDirection[] = ["stack", "stack-reverse", "pipe", "pipe-reverse"];
const FAR_END_STARTS: readonly CellAnimationPlaybackDirection[] = ["reverse", "stack-reverse", "pipe-reverse"];
const computeAlternated = (progress: number, outward: number) => {
    if (outward <= 0) return 1;
    if (progress < outward) return progress / outward;
    if (progress < 1 - outward) return 1;

    return (1 - progress) / outward;
};
const isOrderSwapped = (dir: CellAnimationPlaybackDirection, progress: number) => {
    if (dir === "pipe") return progress > 0.5;
    if (dir === "pipe-reverse") return progress < 0.5;

    return false;
};

/**
 * Turns elapsed time into the position on a cell animation's timeline, for a playback that loops.
 *
 * A cell animation is handed a timeline from `0` to `1` and knows nothing about time. These add the part that
 * does: running it forwards or backwards, and — for the round trips — out and back again with an optional hold
 * at the turn, so a loop can breathe rather than snapping from its end to its start.
 *
 * The two round trips differ in which cell leads the way back. `stack` unwinds the way it came, so the first cell
 * to arrive is the last to leave; `pipe` sends them back in the order they arrived, so the first to arrive is the
 * first to leave. Each has a `-reverse` form that starts at the far end and makes the return trip first.
 */
export namespace CellAnimationPlaybackUtils {
    /**
     * Whether a direction goes out and comes back, rather than running one way.
     *
     * Only a round trip has a turn to hold at, so this is also whether a hold has any effect.
     *
     * @param dir The direction; `normal` if left out.
     * @returns `true` for `stack`, `pipe` and their `-reverse` forms.
     */
    export const isRoundTrip = (dir: CellAnimationPlaybackDirection = DEFAULT_DIRECTION) => ROUND_TRIPS.includes(dir);

    /**
     * How long one full loop takes.
     *
     * A one-way pass, forwards or backwards, takes the duration it was given. A round trip makes both trips and
     * waits at the turn, so it takes twice the duration plus the hold. A negative hold counts as none.
     *
     * @param durationMs How long one trip takes.
     * @param opts The direction — `normal` if left out — and the hold at the turn.
     * @returns The length of one loop, in milliseconds.
     */
    export const computeCycleDurationMs = (durationMs: number, opts?: CellAnimationPlaybackOpts) => {
        if (!isRoundTrip(opts?.dir)) return durationMs;

        return durationMs * 2 + Math.max(opts?.holdMs ?? DEFAULT_HOLD_MS, 0);
    };

    /**
     * Where the animation's own timeline is, at a point through one loop.
     *
     * Forwards is the loop's progress as it is and backwards is its mirror. A round trip spends its first stretch
     * going out, holds at the end for the hold, and spends the last stretch coming back, each trip taking the share
     * of the loop its duration is; the `-reverse` forms do the same starting from the far end. `stack` and `pipe`
     * run this timeline identically — what sets `pipe` apart is {@link computeBreakpointOpts}.
     *
     * @param timeline How far through the loop playback is, from `0` to `1`; values outside are clamped.
     * @param durationMs How long one trip takes, which decides how much of the loop the hold takes up.
     * @param opts The direction and the hold at the turn.
     * @returns The position to hand the animation, from `0` to `1`.
     */
    export const computeGlobalTimeline = (timeline: number, durationMs: number, opts?: CellAnimationPlaybackOpts) => {
        const dir = opts?.dir ?? DEFAULT_DIRECTION;
        const progress = MathUtils.clamp01(timeline);
        const isFarEndStart = FAR_END_STARTS.includes(dir);

        if (!isRoundTrip(dir)) return isFarEndStart ? 1 - progress : progress;

        const cycleMs = computeCycleDurationMs(durationMs, opts);
        const outward = cycleMs > 0 ? MathUtils.clamp01(durationMs / cycleMs) : 0;
        const alternated = computeAlternated(progress, outward);

        return isFarEndStart ? 1 - alternated : alternated;
    };

    /**
     * The breakpoint options to lay a cell's window out with, at a point through one loop.
     *
     * Running the timeline backwards also runs the cells' order backwards, which is what `stack` wants on its way
     * back. `pipe` wants the cells to leave in the order they arrived, so while it is coming back this flips the
     * breakpoints' direction: the cell that led the way out leads the way back too. Flipping the order and
     * running the timeline backwards together play each cell's own trip backwards, easing included, so a single
     * cell leaving looks exactly as it does under `stack` — only the order differs. Every other direction, and
     * `pipe` on its way out, gets the options back unchanged.
     *
     * The turn always falls at the loop's midpoint, inside the hold, so unlike {@link computeGlobalTimeline} this
     * needs no duration: on either side of the midpoint every cell is resting at an end, flipped or not.
     *
     * @param breakpointOpts The options the caller would otherwise hand `computeBreakpoints`.
     * @param timeline How far through the loop playback is, from `0` to `1`; values outside are clamped.
     * @param opts The direction; the hold makes no difference here.
     * @returns The options to hand `computeBreakpoints` at this moment.
     */
    export const computeBreakpointOpts = (
        breakpointOpts: CellAnimationBreakpointOpts,
        timeline: number,
        opts?: CellAnimationPlaybackOpts,
    ): CellAnimationBreakpointOpts => {
        if (!isOrderSwapped(opts?.dir ?? DEFAULT_DIRECTION, MathUtils.clamp01(timeline))) return breakpointOpts;

        return { ...breakpointOpts, dir: breakpointOpts.dir === "desc" ? "asc" : "desc" };
    };
}
