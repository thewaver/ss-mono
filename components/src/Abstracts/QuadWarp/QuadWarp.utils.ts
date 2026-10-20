import {
    MathUtils,
    type Point2d,
    Point2dUtils,
    type Quad,
    type QuadCorner,
    QuadUtils,
    type Rect,
} from "@thewaver/ss-utils";

import type { QuadWarpAxis } from "./QuadWarp.types";

const AXES_LIST: readonly QuadWarpAxis[] = ["x", "y"];
const NEXT = 1;
const OPPOSITE = 2;
const PREVIOUS = -1;
/**
 * How sharply every corner of a moved shape must still turn, as the cross product of its two edges in shares of the
 * box, so a corner is stopped short of lying on the line between its neighbors rather than on it.
 */
const FOLD_MARGIN = 0.01;
const WHOLE = 1;
const NOTHING = 0;
const PERCENT = 100;

/**
 * The arithmetic behind dragging an element's four corners to four chosen points: where a corner can be moved without
 * folding the shape over itself, and what each corner is read out as. `CornerPin` is built on it; the shape itself, and
 * the transform that stretches the element onto it, are `QuadUtils`' in `@thewaver/ss-utils`.
 *
 * The element stays flat with straight edges; only where its corners land is chosen.
 */
export namespace QuadWarpUtils {
    /** The two axes a corner moves along, across and then down. */
    export const AXES = AXES_LIST;

    /** The corners of a box left as it is, in shares of the box. */
    export const RESTING_CORNERS: Quad = {
        top_left: { x: 0, y: 0 },
        top_right: { x: 1, y: 0 },
        bottom_right: { x: 1, y: 1 },
        bottom_left: { x: 0, y: 1 },
    };

    /**
     * Where one corner can be moved to, on the way to where it was asked to go.
     *
     * It is held inside the box widened by `reachRatio` on every side, then stopped along the straight path from where
     * it stands at the point where the shape would start to fold, a little before any corner would lie on the line
     * between its neighbors. A shape that was already folded is never folded further: the corner may move only in
     * ways that do not make it worse.
     *
     * @param corners Where every corner is now, in shares of the box.
     * @param corner The corner being moved.
     * @param target Where it was asked to go, in shares of the box.
     * @param reachRatio How far past each edge of the box a corner may go, in shares of the box.
     * @returns Where it goes, in shares of the box.
     */
    export const clampMove = (corners: Quad, corner: QuadCorner, target: Point2d, reachRatio: number): Point2d => {
        const from = corners[corner];
        const to = {
            x: MathUtils.clamp(target.x, -reachRatio, WHOLE + reachRatio),
            y: MathUtils.clamp(target.y, -reachRatio, WHOLE + reachRatio),
        };
        const previous = corners[QuadUtils.getNeighbor(corner, PREVIOUS)];
        const next = corners[QuadUtils.getNeighbor(corner, NEXT)];
        const opposite = corners[QuadUtils.getNeighbor(corner, OPPOSITE)];
        const turns = [
            (at: Point2d) => Point2dUtils.getCornerTurn(opposite, previous, at),
            (at: Point2d) => Point2dUtils.getCornerTurn(previous, at, next),
            (at: Point2d) => Point2dUtils.getCornerTurn(at, next, opposite),
        ];

        const share = turns.reduce((least, getTurn) => {
            const start = getTurn(from);
            const end = getTurn(to);

            if (end >= FOLD_MARGIN || end >= start) return least;

            return Math.min(least, start <= FOLD_MARGIN ? NOTHING : (start - FOLD_MARGIN) / (start - end));
        }, WHOLE);

        return { x: from.x + (to.x - from.x) * share, y: from.y + (to.y - from.y) * share };
    };

    /**
     * Where a point on screen falls across a box, as a share of the box on each axis.
     *
     * Both are measured on screen, so a scaled ancestor changes neither.
     *
     * @param point The point, in screen pixels.
     * @param rect The box as measured on screen.
     * @returns `0` to `1` across the box on each axis, and beyond it outside the box.
     */
    export const toBoxRatio = (point: Point2d, rect: Rect): Point2d => ({
        x: rect.width > NOTHING ? (point.x - rect.x) / rect.width : NOTHING,
        y: rect.height > NOTHING ? (point.y - rect.y) / rect.height : NOTHING,
    });

    /**
     * What one axis of a corner is read out as.
     *
     * @param point The corner, in shares of the box.
     * @param axis The axis.
     * @returns The share as a whole percentage followed by `%`, for an `aria-valuetext`.
     */
    export const computeValueText = (point: Point2d, axis: QuadWarpAxis) => `${Math.round(point[axis] * PERCENT)}%`;
}
