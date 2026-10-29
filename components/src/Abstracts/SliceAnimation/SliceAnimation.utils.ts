import {
    type CSSAnimationKey,
    type CSSAnimationStyle,
    type CSSAnimationValues,
    CSSUtils,
    type Index2d,
    MathUtils,
} from "@thewaver/ss-utils";

import type { SliceAnimationEvaluationDefs } from "../../Exotics/Animations/CellAnimation/CellAnimation.types";
import type { SliceAnimationBreakpointOpts } from "../../Generators/SliceAnimationBreakpoints/SliceAnimationBreakpoints.types";
import { SliceAnimationBreakpointUtils } from "../../Generators/SliceAnimationBreakpoints/SliceAnimationBreakpoints.utils";
import type {
    SliceAnimationFn,
    SliceStop,
} from "../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import type { SliceAnimationPlaybackOpts } from "../../Generators/SliceAnimationPlayback/SliceAnimationPlayback.types";
import { SliceAnimationPlaybackUtils } from "../../Generators/SliceAnimationPlayback/SliceAnimationPlayback.utils";
import type {
    SliceAnimationPassDefs,
    SliceAnimationSlice,
    SliceAnimationTables,
    SliceAnimationTiming,
    SliceAnimationWindow,
} from "./SliceAnimation.types";

const NO_PROGRESS = 0;
const FULL_PROGRESS = 1;
const NO_BREAKPOINT_OPTS: SliceAnimationBreakpointOpts = {};
const LEADING_WEIGHT = 1;

const written = new WeakMap<HTMLElement, { values: CSSAnimationValues; style: CSSAnimationStyle }>();

const isSameValue = (a: number | number[] | undefined, b: number | number[] | undefined) =>
    Array.isArray(a) && Array.isArray(b) ? a.length === b.length && a.every((value, idx) => value === b[idx]) : a === b;

const isSameValues = (a: CSSAnimationValues, b: CSSAnimationValues) => {
    for (const key in a) {
        if (!isSameValue(a[key as CSSAnimationKey], b[key as CSSAnimationKey])) return false;
    }

    for (const key in b) {
        if (!(key in a)) return false;
    }

    return true;
};

/**
 * What every slice animation shares — the cells of `CellAnimation`, the lines of `ScanlineAnimation`, the channels of
 * `RGBAnimation` and the particles of `ParticleField`: the clock that runs the passes, the timing that turns a pass
 * into each slice's own progress, the tables a sample is built from, and writing a frame's values onto an element.
 */
export namespace SliceAnimationUtils {
    /**
     * Writes an animation's values onto an element as `transform`, `filter` and `opacity`.
     *
     * Set on the element's style directly rather than through a signal, because this runs for every slice on every
     * frame and the reactive round trip is not affordable at that rate. Values equal to the last ones written to the
     * element are not worked out again, and a property whose text has not changed is not written again.
     *
     * @param el The element. Its `transform`, `filter` and `opacity` must be left to this function: a change made to
     * them anywhere else is not noticed, and stands until the animation's own value changes.
     * @param evalResult The animation's values for this slice and frame, by CSS function name. Functions not mentioned
     * are left out, so a value that stops being produced stops applying. Compared with the last values by content, so
     * an object changed after it was handed over is not noticed.
     */
    export const assignAnimationProps = (el: HTMLElement, evalResult: CSSAnimationValues) => {
        const last = written.get(el);

        if (last && last.values !== evalResult && isSameValues(last.values, evalResult)) return;

        const style = CSSUtils.toAnimationStyle(evalResult);

        if (style.transform !== last?.style.transform) el.style.transform = style.transform;
        if (style.filter !== last?.style.filter) el.style.filter = style.filter;
        if (style.opacity !== last?.style.opacity) el.style.opacity = style.opacity;

        written.set(el, { values: evalResult, style });
    };

    /**
     * Runs passes on animation frames until stopped or until the last pass is done.
     *
     * Each frame reads the progress afresh and adds the time since the last, so a write from outside between frames
     * is carried on from — which is how a consumer scrubs while playing. At the end of a pass it reports it, and
     * either counts the last pass done and stops, or waits the delay, starts the next pass at `0` and carries on.
     *
     * @param defs.getProgress How far through the pass, `0`–`1`.
     * @param defs.setProgress Writes the progress.
     * @param defs.getCurrentIteration Passes finished so far.
     * @param defs.setCurrentIteration Writes it.
     * @param defs.getDurationMs How long one pass takes. `0` or less finishes a pass on its first frame.
     * @param defs.getIterationCount How many passes to run.
     * @param defs.getIterationDelayMs How long to wait between passes.
     * @param defs.onIterationEnd Runs at the end of each pass.
     * @param defs.onAnimationEnd Runs once the last pass is done, before it is counted.
     * @returns Stops the frames and any wait between passes. Another call starts again from the progress as it is.
     */
    export const runPasses = (defs: SliceAnimationPassDefs) => {
        let frameId: ReturnType<typeof requestAnimationFrame> | undefined;
        let timeout: ReturnType<typeof setTimeout> | undefined;
        let lastMs = performance.now();

        const advance = (nowMs: number) => {
            const durationMs = defs.getDurationMs();
            const elapsedMs = Math.max(nowMs - lastMs, 0);
            const next =
                durationMs > 0
                    ? Math.min(MathUtils.clamp01(defs.getProgress()) + elapsedMs / durationMs, FULL_PROGRESS)
                    : FULL_PROGRESS;

            frameId = undefined;
            lastMs = nowMs;
            defs.setProgress(next);

            if (next < FULL_PROGRESS) {
                frameId = requestAnimationFrame(advance);

                return;
            }

            defs.onIterationEnd?.();

            if (defs.getCurrentIteration() + 1 >= defs.getIterationCount()) {
                defs.onAnimationEnd?.();
                defs.setCurrentIteration(defs.getCurrentIteration() + 1);

                return;
            }

            timeout = setTimeout(() => {
                timeout = undefined;
                defs.setProgress(NO_PROGRESS);
                defs.setCurrentIteration(defs.getCurrentIteration() + 1);
                lastMs = performance.now();
                frameId = requestAnimationFrame(advance);
            }, defs.getIterationDelayMs());
        };

        frameId = requestAnimationFrame(advance);

        return () => {
            if (frameId !== undefined) cancelAnimationFrame(frameId);

            clearTimeout(timeout);
        };
    };

    /**
     * Every slice with the origin a sample measures from, for handing to the sample.
     *
     * Built once per grid rather than per frame, so a sample that keeps anything per slice sees the same object on
     * every frame.
     *
     * @param slices The slices, as the component lays them out.
     * @param origin The slice the sample measures from — what its zones and its weights take as the center.
     */
    export const withOrigin = (slices: SliceAnimationEvaluationDefs[], origin: Index2d): SliceAnimationSlice[] =>
        slices.map((slice) => ({ ...slice, origin }));

    /**
     * How long one loop of a pass takes, a round trip included.
     *
     * @param durationMs How long one trip takes.
     * @param playbackOpts The direction and the hold at the turn; a one-way pass if left out.
     */
    export const computeCycleDurationMs = (durationMs: number, playbackOpts: SliceAnimationPlaybackOpts | undefined) =>
        SliceAnimationPlaybackUtils.computeCycleDurationMs(durationMs, playbackOpts);

    /**
     * Where a pass stands at one moment, worked out once for every slice of a frame.
     *
     * The loop's progress becomes the sample's own timeline — mirrored for a backward or a round trip — and the
     * breakpoint options are those to lay each slice's window out with at this moment, flipped while a `pipe` comes
     * back.
     *
     * @param progress How far through the loop, `0`–`1`; values outside are clamped.
     * @param durationMs How long one trip takes, which decides how much of a round trip the hold takes up.
     * @param breakpointOpts How each slice's window is laid out from its weight; the defaults if left out.
     * @param playbackOpts The direction and the hold at the turn; a one-way pass if left out.
     */
    export const computeTiming = (
        progress: number,
        durationMs: number,
        breakpointOpts: SliceAnimationBreakpointOpts | undefined,
        playbackOpts: SliceAnimationPlaybackOpts | undefined,
    ): SliceAnimationTiming => {
        const timeline = MathUtils.clamp01(progress);

        return {
            globalTimeline: SliceAnimationPlaybackUtils.computeGlobalTimeline(timeline, durationMs, playbackOpts),
            breakpointOpts: SliceAnimationPlaybackUtils.computeBreakpointOpts(
                breakpointOpts ?? NO_BREAKPOINT_OPTS,
                timeline,
                playbackOpts,
            ),
        };
    };

    /**
     * One slice's values at one moment: its window from its weight, its own progress through that window, eased,
     * and the sample at that progress.
     *
     * @param animation The sample.
     * @param slice The slice, with its origin.
     * @param timing From {@link computeTiming}, once per frame.
     */
    export const computeValues = (
        animation: SliceAnimationFn,
        slice: SliceAnimationSlice,
        timing: SliceAnimationTiming,
    ): CSSAnimationValues =>
        animation(
            SliceAnimationBreakpointUtils.computeLocalTimeline(
                SliceAnimationBreakpointUtils.computeBreakpoints(slice.weight, timing.breakpointOpts),
                timing.globalTimeline,
                timing.breakpointOpts.easing,
            ),
            slice,
        );

    /**
     * The shape every slice's window shares at one moment, for a renderer that lays the windows out itself.
     *
     * Every window has the same length, so half of it and the direction the weights run in are all that is needed to
     * place any slice's window from its weight.
     *
     * @param timing From {@link computeTiming}.
     */
    export const computeWindow = (timing: SliceAnimationTiming): SliceAnimationWindow => ({
        half: SliceAnimationBreakpointUtils.computeBreakpoints(LEADING_WEIGHT, {
            ...timing.breakpointOpts,
            dir: "asc",
        })[1],
        isDescending: timing.breakpointOpts.dir === "desc",
    });

    /**
     * The tables a sample plays on each slice, each distinct table once, for a renderer that works the keyframes out
     * itself.
     *
     * @param animation The sample.
     * @param slices Every slice, with its origin.
     * @returns The distinct tables and each slice's index into them, or `undefined` when the sample, or any part of
     * it a slice reaches, was written by hand rather than built by `SliceAnimationKeyframeUtils`.
     */
    export const resolveTables = (
        animation: SliceAnimationFn,
        slices: SliceAnimationSlice[],
    ): SliceAnimationTables | undefined => {
        if (!SliceAnimationKeyframeUtils.getDefinition(animation)) return undefined;

        const indices = new Map<SliceStop[], number>();
        const tableIndices: number[] = [];

        for (const slice of slices) {
            const stops = SliceAnimationKeyframeUtils.resolveStops(animation, slice);

            if (!stops) return undefined;
            if (!indices.has(stops)) indices.set(stops, indices.size);

            tableIndices.push(indices.get(stops) ?? 0);
        }

        return { tables: [...indices.keys()], tableIndices };
    };
}
