import { type CSSAnimationValues, CSSUtils, type Index2d, MathUtils, type Size2d } from "@thewaver/ss-utils";

import type { CellAnimationEvaluationDefs, CellAnimationFinalFrame } from "./CellAnimation.types";

const DEFAULT_CELL_WEIGHT = 0;
const PERSPECTIVE_RATIO = 1.5;
const BLEED_PX = 1;
const DEPTH_STEPS = 100;
const NO_PROGRESS = 0;
const FULL_PROGRESS = 1;

/** A cell's place in the grid and its share of the drawing, before its size is known. */
export type CellAnimationCellDefs = Omit<CellAnimationEvaluationDefs, "size">;

/** Where a cell sits and how large it is, in the animation's own pixels. */
export type CellAnimationCellBounds = { col: number; row: number; width: number; height: number };

/**
 * Cuts a picture into a grid of cells, runs its passes, applies an animation's numbers to each cell, and answers which
 * cells alternate with which.
 *
 * The numbers come from evaluating the animation per cell and per frame; what is here is the grid's arithmetic, the
 * clock that drives the passes, turning the numbers into CSS, and the parity tests that let a wave, a ripple or a
 * checkerboard alternate direction across the grid. `ParticleField` runs on the same grid and the same clock.
 */
export namespace CellAnimationUtils {
    /**
     * Writes an animation's values onto a cell as `transform` and `filter`.
     *
     * Set on the element's style directly rather than through a signal, because this runs for every cell
     * on every frame and the reactive round trip is not affordable at that rate.
     *
     * @param el The cell's element.
     * @param evalResult The animation's values for this cell and frame, by CSS function name. Functions
     * not mentioned are left out, and both properties are rewritten in full each time, so a value that
     * stops being produced stops applying.
     */
    export const assignAnimationProps = (el: HTMLElement, evalResult: CSSAnimationValues) => {
        const style = CSSUtils.toAnimationStyle(evalResult);

        el.style.transform = style.transform;
        el.style.filter = style.filter;
    };

    /**
     * Whether a cell sits on an even row.
     *
     * @param dist The cell's distance from the animation's origin, in cells.
     */
    export const isEvenRow = (dist: Index2d) => MathUtils.isEven(dist.row);

    /**
     * Whether a cell sits on an even column.
     *
     * @param dist The cell's distance from the animation's origin, in cells.
     */
    export const isEvenColumn = (dist: Index2d) => MathUtils.isEven(dist.col);

    /**
     * Whether a cell sits on an even ring around the origin.
     *
     * Rings are square rather than round: every cell the same number of steps out along the longer axis
     * is on the same ring, which is what makes a ripple spread as a growing square.
     *
     * @param dist The cell's distance from the animation's origin, in cells.
     */
    export const isEvenRing = (dist: Index2d) =>
        !((!isEvenColumn(dist) && dist.row <= dist.col) || (!isEvenRow(dist) && dist.col <= dist.row));

    /**
     * Whether a cell sits on a light or a dark square of a checkerboard.
     *
     * @param dist The cell's distance from the animation's origin, in cells.
     */
    export const isEvenCheckered = (dist: Index2d) => MathUtils.isEven(dist.col + dist.row);

    /**
     * How many cells a grid really has, from the count asked for and the room there is.
     *
     * Rounded to whole cells and held between one and one per pixel on each axis, so a grid never has no cells and
     * never has cells too thin to draw.
     *
     * @param requested The count asked for, across and down.
     * @param size The room the grid has.
     */
    export const computeCellCount = (requested: Index2d, size: Size2d): Index2d => ({
        col: MathUtils.clamp(Math.round(requested.col), 1, Math.max(Math.round(size.width), 1)),
        row: MathUtils.clamp(Math.round(requested.row), 1, Math.max(Math.round(size.height), 1)),
    });

    /**
     * Whether two counts name the same grid.
     *
     * @param a One count.
     * @param b The other.
     */
    export const getIsSameCount = (a: Index2d, b: Index2d) => a.col === b.col && a.row === b.row;

    /**
     * Where the lines between cells fall along one side, rounded to whole pixels.
     *
     * @param length The side's length.
     * @param count How many cells lie along it.
     * @returns `count + 1` positions, from `0` to `length`.
     */
    export const computeEdges = (length: number, count: number) =>
        Array.from({ length: count + 1 }, (_, idx) => Math.round((idx * length) / count));

    /**
     * Where one cell sits and how large it is.
     *
     * Each cell reaches a pixel past its right and bottom edges, so neighbors overlap rather than leave a hairline
     * of background between them as they move.
     *
     * @param columnEdges From {@link computeEdges} across.
     * @param rowEdges From {@link computeEdges} down.
     * @param pos The cell's place in the grid.
     */
    export const computeCellBounds = (
        columnEdges: number[],
        rowEdges: number[],
        pos: Index2d,
    ): CellAnimationCellBounds => ({
        col: columnEdges[pos.col],
        row: rowEdges[pos.row],
        width: columnEdges[pos.col + 1] - columnEdges[pos.col] + BLEED_PX,
        height: rowEdges[pos.row + 1] - rowEdges[pos.row] + BLEED_PX,
    });

    /**
     * Every cell of a grid, in reading order, with its weight.
     *
     * @param count The grid's size in cells.
     * @param weights A weight per cell, by row then column. A cell with none counts as `0`.
     */
    export const computeCellDefs = (count: Index2d, weights: number[][]): CellAnimationCellDefs[] =>
        Array.from({ length: count.col * count.row }, (_, idx) => {
            const pos = { col: idx % count.col, row: Math.floor(idx / count.col) };

            return { pos, count, weight: weights[pos.row]?.[pos.col] ?? DEFAULT_CELL_WEIGHT };
        });

    /**
     * What each cell's animation is handed: its defs and its drawn size.
     *
     * @param cellDefs From {@link computeCellDefs}.
     * @param columnEdges From {@link computeEdges} across.
     * @param rowEdges From {@link computeEdges} down.
     */
    export const computeEvaluationDefs = (
        cellDefs: CellAnimationCellDefs[],
        columnEdges: number[],
        rowEdges: number[],
    ): CellAnimationEvaluationDefs[] =>
        cellDefs.map((defs) => {
            const bounds = computeCellBounds(columnEdges, rowEdges, defs.pos);

            return { ...defs, size: { width: bounds.width, height: bounds.height } };
        });

    /**
     * How far off the viewer sits, for cells that turn in depth.
     *
     * @param size The grid's size.
     * @returns A `perspective` value: half again the longer side, or `none` before the grid has a size.
     */
    export const computePerspective = (size: Size2d) => {
        const perspective = Math.max(size.width, size.height) * PERSPECTIVE_RATIO;

        return perspective > 0 ? `${perspective}px` : "none";
    };

    /**
     * Which cells are drawn in front: the lighter a cell, the nearer.
     *
     * @param weight The cell's weight.
     * @returns A whole `z-index`.
     */
    export const computeCellDepth = (weight: number) => Math.floor((1 - weight) * DEPTH_STEPS);

    /**
     * A source as a CSS image, quoted.
     *
     * A drawn source is a data URI carrying parentheses, which CSS refuses inside an unquoted `url()` — the cells
     * would paint nothing while the box still sized itself.
     *
     * @param src The source's address.
     */
    export const toSourceImage = (src: string) => `url("${src}")`;

    /**
     * What the grid shows, given how many passes have run.
     *
     * @param currentIteration Passes finished so far.
     * @param iterationCount Passes asked for.
     * @param finalFrame What the grid is left showing once they are done.
     * @returns `hasEnded` once every pass has run; `areCellsMounted` until then, and afterwards only for a final frame
     * of `cells`; `isSourceRevealed` afterwards for a final frame of `source`.
     */
    export const computeFrameState = (
        currentIteration: number,
        iterationCount: number,
        finalFrame: CellAnimationFinalFrame,
    ) => {
        const hasEnded = currentIteration >= iterationCount;

        return {
            hasEnded,
            areCellsMounted: !hasEnded || finalFrame === "cells",
            isSourceRevealed: hasEnded && finalFrame === "source",
        };
    };

    /**
     * Draws one frame: the whole picture's animation on the root, then each cell's on its cell.
     *
     * @param root The animation's root element.
     * @param cells The cells' elements, in the order of `cellDefs`. A shorter list draws only as many.
     * @param cellDefs What each cell's animation is handed, from {@link computeEvaluationDefs}.
     * @param progress How far through the pass, held to `0`–`1` here.
     * @param computeRootAnimation What the whole picture does, if anything.
     * @param computeCellAnimation What one cell does.
     */
    export const drawFrame = (
        root: HTMLElement,
        cells: HTMLElement[],
        cellDefs: CellAnimationEvaluationDefs[],
        progress: number,
        computeRootAnimation: ((timeline: number) => CSSAnimationValues) | undefined,
        computeCellAnimation: (defs: CellAnimationEvaluationDefs, timeline: number) => CSSAnimationValues,
    ) => {
        const t = MathUtils.clamp01(progress);

        if (computeRootAnimation) assignAnimationProps(root, computeRootAnimation(t));

        for (let i = 0; i < cells.length && i < cellDefs.length; i++) {
            assignAnimationProps(cells[i], computeCellAnimation(cellDefs[i], t));
        }
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
    export const runPasses = (defs: {
        getProgress: () => number;
        setProgress: (progress: number) => void;
        getCurrentIteration: () => number;
        setCurrentIteration: (iteration: number) => void;
        getDurationMs: () => number;
        getIterationCount: () => number;
        getIterationDelayMs: () => number;
        onIterationEnd?: () => void;
        onAnimationEnd?: () => void;
    }) => {
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
}
