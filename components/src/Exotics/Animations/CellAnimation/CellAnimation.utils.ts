import { type CSSAnimationValues, type Index2d, MathUtils, type Size2d } from "@thewaver/ss-utils";

import type { SliceAnimationSlice, SliceAnimationTiming } from "../../../Abstracts/SliceAnimation/SliceAnimation.types";
import { SliceAnimationUtils } from "../../../Abstracts/SliceAnimation/SliceAnimation.utils";
import type { SliceAnimationFn } from "../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import type { CellAnimationFinalFrame, SliceAnimationEvaluationDefs } from "./CellAnimation.types";

const DEFAULT_CELL_WEIGHT = 0;
const PERSPECTIVE_RATIO = 1.5;
const BLEED_PX = 1;
const DEPTH_STEPS = 100;

/** A cell's place in the grid and its share of the drawing, before its size is known. */
export type CellAnimationCellDefs = Omit<SliceAnimationEvaluationDefs, "size">;

/** Where a cell sits and how large it is, in the animation's own pixels. */
export type CellAnimationCellBounds = { col: number; row: number; width: number; height: number };

/**
 * Cuts a picture into a grid of cells, applies a sample's numbers to each cell, and answers which cells alternate with
 * which.
 *
 * What is here is the grid's arithmetic, drawing a frame onto the cells, and the parity tests that let a wave, a ripple
 * or a checkerboard alternate direction across the grid. The clock and the timing every slice animation shares are in
 * `SliceAnimationUtils`. `ParticleField` runs on the same grid and the same clock.
 */
export namespace CellAnimationUtils {
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
    ): SliceAnimationEvaluationDefs[] =>
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
     * @param cells The cells' elements, in the order of `slices`. A shorter list draws only as many.
     * @param slices Every cell with its origin, from `SliceAnimationUtils.withOrigin`.
     * @param progress How far through the pass, held to `0`–`1` here; what the whole picture's animation is handed.
     * @param timing Where the pass stands, from `SliceAnimationUtils.computeTiming`.
     * @param computeRootAnimation What the whole picture does, if anything.
     * @param computeSliceAnimation The sample each cell plays.
     */
    export const drawFrame = (
        root: HTMLElement,
        cells: HTMLElement[],
        slices: SliceAnimationSlice[],
        progress: number,
        timing: SliceAnimationTiming,
        computeRootAnimation: ((timeline: number) => CSSAnimationValues) | undefined,
        computeSliceAnimation: SliceAnimationFn,
    ) => {
        if (computeRootAnimation) {
            SliceAnimationUtils.assignAnimationProps(root, computeRootAnimation(MathUtils.clamp01(progress)));
        }

        for (let i = 0; i < cells.length && i < slices.length; i++) {
            SliceAnimationUtils.assignAnimationProps(
                cells[i],
                SliceAnimationUtils.computeValues(computeSliceAnimation, slices[i], timing),
            );
        }
    };
}
