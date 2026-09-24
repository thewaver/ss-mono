import { MathUtils } from "@thewaver/ss-utils";

import type {
    CellAnimationBreakpointOpts,
    CellAnimationBreakpointTriple,
    CellAnimationEasing,
} from "./CellAnimationBreakpoints.types";

const DEFAULT_SMOOTHNESS = 0.25;
const DEFAULT_EASING: CellAnimationEasing = "linear";
const EASING_CONTROLS: Record<Exclude<CellAnimationEasing, "linear">, [number, number, number, number]> = {
    "ease": [0.25, 0.1, 0.25, 1],
    "ease-in": [0.42, 0, 1, 1],
    "ease-out": [0, 0, 0.58, 1],
    "ease-in-out": [0.42, 0, 0.58, 1],
};
const NEWTON_ITERATIONS = 8;
const BISECTION_ITERATIONS = 16;
const SOLVE_EPSILON = 1e-6;
const computeAxis = (first: number, second: number) => {
    const c = 3 * first;
    const b = 3 * (second - first) - c;

    return { a: 1 - c - b, b, c };
};
const computeCurve = ({ a, b, c }: { a: number; b: number; c: number }, t: number) => ((a * t + b) * t + c) * t;
const computeSlope = ({ a, b, c }: { a: number; b: number; c: number }, t: number) => (3 * a * t + 2 * b) * t + c;
const computeEasedRatio = (easing: CellAnimationEasing, ratio: number) => {
    if (easing === DEFAULT_EASING) return ratio;

    const [x1, y1, x2, y2] = EASING_CONTROLS[easing];
    const x = computeAxis(x1, x2);
    const y = computeAxis(y1, y2);

    let t = ratio;

    for (let step = 0; step < NEWTON_ITERATIONS; step++) {
        const error = computeCurve(x, t) - ratio;

        if (Math.abs(error) < SOLVE_EPSILON) return computeCurve(y, t);

        const slope = computeSlope(x, t);

        if (Math.abs(slope) < SOLVE_EPSILON) break;

        t -= error / slope;
    }

    let low = 0;
    let high = 1;

    t = ratio;

    for (let step = 0; step < BISECTION_ITERATIONS; step++) {
        const error = computeCurve(x, t) - ratio;

        if (Math.abs(error) < SOLVE_EPSILON) break;

        if (error > 0) high = t;
        else low = t;

        t = (low + high) * 0.5;
    }

    return computeCurve(y, t);
};

/**
 * When each cell of a cell animation plays, worked out from its weight.
 *
 * A cell animation hands every cell the same timeline and staggers them by weight. These turn a weight into the
 * window of that timeline the cell plays in, and turn the shared timeline into the cell's own progress through
 * its window — which is also where an easing curve is applied, so the curve bends each cell's motion rather
 * than the stagger.
 */
export namespace CellAnimationBreakpointUtils {
    /**
     * The window a cell plays in, as a start, a middle and an end on a timeline running from `0` to `1`.
     *
     * By default a heavy cell goes first and a light one last; a descending direction reverses that. The
     * smoothness is how much of the timeline one window takes: `0` makes every cell an instant, and `1` makes
     * every window the whole timeline, so all cells move together. A weight or a smoothness outside `0` to `1`
     * is clamped rather than producing a window that runs backwards or past the end.
     *
     * @param weight The cell's weight, from `0` to `1`.
     * @param opts The direction, the smoothness — `0.25` if left out — and an easing carried along for
     * {@link computeLocalTimeline}.
     * @returns The window's start, middle and end.
     */
    export const computeBreakpoints = (
        weight: number,
        opts?: CellAnimationBreakpointOpts,
    ): CellAnimationBreakpointTriple => {
        const directed = opts?.dir === "desc" ? weight : 1 - weight;
        const progress = MathUtils.clamp01(directed);
        const half = MathUtils.clamp01(opts?.smoothness ?? DEFAULT_SMOOTHNESS) * 0.5;
        const start = progress * (1 - 2 * half);

        return [start, start + half, start + 2 * half];
    };

    /**
     * How far through its own window a cell is, at a point on the shared timeline.
     *
     * Before the window the answer is `0` and after it `1`, so a cell waits at its first frame and then rests at
     * its last. Inside, the progress is run through the easing curve, whose ends are held at `0` and `1` so a
     * cell still starts and finishes exactly where its window says. A window with no length is a step.
     *
     * @param breakpoints The cell's window, from {@link computeBreakpoints}.
     * @param timeline Where the shared timeline is, from `0` to `1`.
     * @param easing The curve to apply; linear, the default, leaves the progress as it is.
     * @returns The cell's own progress, from `0` to `1`, never decreasing as the timeline moves forward.
     */
    export const computeLocalTimeline = (
        [start, , end]: CellAnimationBreakpointTriple,
        timeline: number,
        easing: CellAnimationEasing = DEFAULT_EASING,
    ) => {
        if (end <= start) return timeline >= end ? 1 : 0;

        return computeEasedRatio(easing, MathUtils.clamp01(MathUtils.normalize(timeline, start, end)));
    };
}
