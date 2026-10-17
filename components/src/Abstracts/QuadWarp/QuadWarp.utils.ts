import { MathUtils, Point2d } from "@thewaver/ss-utils";
import type { Point3d, Rect, Size2d } from "@thewaver/ss-utils";

import type { CornerKey, QuadWarpAxis, QuadWarpCorners } from "./QuadWarp.types";

/** The corners in the order they run round the shape, clockwise on screen from the top left. */
const ORDER: readonly CornerKey[] = ["top_left", "top_right", "bottom_right", "bottom_left"];
const AXES_LIST: readonly QuadWarpAxis[] = ["x", "y"];
const CORNER_COUNT = 4;
const NEXT = 1;
const OPPOSITE = 2;
const PREVIOUS = 3;
/**
 * How sharply every corner of a moved shape must still turn, as the cross product of its two edges in shares of the
 * box, so a corner is stopped short of lying on the line between its neighbors rather than on it.
 */
const FOLD_MARGIN = 0.01;
const WHOLE = 1;
const NOTHING = 0;
const PERCENT = 100;

/** How far the path turns at `b`, going from `a` through `b` to `c`: positive for a clockwise turn on screen. */
const turn = (a: Point2d, b: Point2d, c: Point2d) => {
    const into = Point2d.sub(b, a);
    const out = Point2d.sub(c, b);

    return into.x * out.y - into.y * out.x;
};

const getNeighbor = (corner: CornerKey, offset: number) => ORDER[(ORDER.indexOf(corner) + offset) % CORNER_COUNT];

/**
 * The eight numbers of the projective map taking the box's own corners to the four given, or `undefined` where no
 * such map draws a shape.
 *
 * A point `(u, v)` of a box one unit square lands at `((a·u + b·v + c) / w, (d·u + e·v + f) / w)` with
 * `w = g·u + h·v + 1`.
 */
const computeSquareMap = (corners: QuadWarpCorners) => {
    const { top_left: p0, top_right: p1, bottom_right: p2, bottom_left: p3 } = corners;
    const dx1 = p1.x - p2.x;
    const dx2 = p3.x - p2.x;
    const dx3 = p0.x - p1.x + p2.x - p3.x;
    const dy1 = p1.y - p2.y;
    const dy2 = p3.y - p2.y;
    const dy3 = p0.y - p1.y + p2.y - p3.y;
    const det = dx1 * dy2 - dx2 * dy1;
    const g = (dx3 * dy2 - dx2 * dy3) / det;
    const h = (dx1 * dy3 - dx3 * dy1) / det;

    return {
        a: p1.x - p0.x + g * p1.x,
        b: p3.x - p0.x + h * p3.x,
        c: p0.x,
        d: p1.y - p0.y + g * p1.y,
        e: p3.y - p0.y + h * p3.y,
        f: p0.y,
        g,
        h,
    };
};

/**
 * The arithmetic behind pinning an element's four corners to four chosen points: the transform that stretches the
 * element onto them, where a corner can be moved without folding the shape over itself, and where a point in front of
 * a viewer is drawn on screen. `CornerPin` is built on it, and so is any layout that knows where its items' corners
 * belong, such as `CorridorLayoutUtils.tube`.
 *
 * The element stays flat with straight edges; only where its corners land is chosen.
 */
export namespace QuadWarpUtils {
    /** The four corners, clockwise on screen from the top left. */
    export const CORNERS = ORDER;

    /** The two axes a corner moves along, across and then down. */
    export const AXES = AXES_LIST;

    /** The corners of a box left as it is, in shares of the box. */
    export const RESTING_CORNERS: QuadWarpCorners = {
        top_left: { x: 0, y: 0 },
        top_right: { x: 1, y: 0 },
        bottom_right: { x: 1, y: 1 },
        bottom_left: { x: 0, y: 1 },
    };

    /**
     * Whether four corners make a shape that can be drawn: every corner turns the same way, clockwise on screen, so
     * no edge crosses another and no corner sits on the line between its neighbors.
     *
     * @param corners The corners, in any one unit.
     */
    export const getIsConvex = (corners: QuadWarpCorners) =>
        ORDER.every(
            (corner) =>
                turn(corners[getNeighbor(corner, PREVIOUS)], corners[corner], corners[getNeighbor(corner, NEXT)]) >
                NOTHING,
        );

    /**
     * CornerHighlight given in shares of a box, in that box's pixels.
     *
     * @param corners The corners, `0` to `1` across each axis of the box, and beyond it past the box's edges.
     * @param size The box, in pixels.
     * @returns The corners in pixels from the box's top left.
     */
    export const toPixels = (corners: QuadWarpCorners, size: Size2d): QuadWarpCorners => ({
        top_left: { x: corners.top_left.x * size.width, y: corners.top_left.y * size.height },
        top_right: { x: corners.top_right.x * size.width, y: corners.top_right.y * size.height },
        bottom_right: { x: corners.bottom_right.x * size.width, y: corners.bottom_right.y * size.height },
        bottom_left: { x: corners.bottom_left.x * size.width, y: corners.bottom_left.y * size.height },
    });

    /**
     * Where a point of an element is drawn once its corners are pinned.
     *
     * @param size The element's own size, in pixels.
     * @param corners Where its corners go, in pixels from its own top left.
     * @param point The point, in pixels from the element's top left before it is moved.
     * @returns Where it is drawn, in the same pixels, or `undefined` when the corners are not {@link getIsConvex} or
     * the element has no size.
     */
    export const mapPoint = (size: Size2d, corners: QuadWarpCorners, point: Point2d): Point2d | undefined => {
        if (size.width <= NOTHING || size.height <= NOTHING || !getIsConvex(corners)) return undefined;

        const { a, b, c, d, e, f, g, h } = computeSquareMap(corners);
        const u = point.x / size.width;
        const v = point.y / size.height;
        const w = g * u + h * v + WHOLE;

        return { x: (a * u + b * v + c) / w, y: (d * u + e * v + f) / w };
    };

    /**
     * The CSS `transform` that puts an element's corners where they are asked to go.
     *
     * The element is stretched as a flat sheet seen in perspective, so straight lines inside it stay straight and the
     * half nearer a pulled-in corner is squeezed, as a sheet tipped away would be. **It needs `transform-origin: 0 0`
     * on the element**, since the corners are measured from its own top left.
     *
     * @param size The element's own size, in pixels, before it is moved.
     * @param corners Where its corners go, in pixels from its own top left.
     * @returns A `matrix3d(…)` value, or `undefined` when the corners are not {@link getIsConvex} or the element has
     * no size.
     */
    export const toTransform = (size: Size2d, corners: QuadWarpCorners) => {
        if (size.width <= NOTHING || size.height <= NOTHING || !getIsConvex(corners)) return undefined;

        const { a, b, c, d, e, f, g, h } = computeSquareMap(corners);
        const across = WHOLE / size.width;
        const down = WHOLE / size.height;

        return `matrix3d(${a * across}, ${d * across}, 0, ${g * across}, ${b * down}, ${e * down}, 0, ${h * down}, 0, 0, 1, 0, ${c}, ${f}, 0, 1)`;
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
    export const clampMove = (
        corners: QuadWarpCorners,
        corner: CornerKey,
        target: Point2d,
        reachRatio: number,
    ): Point2d => {
        const from = corners[corner];
        const to = {
            x: MathUtils.clamp(target.x, -reachRatio, WHOLE + reachRatio),
            y: MathUtils.clamp(target.y, -reachRatio, WHOLE + reachRatio),
        };
        const previous = corners[getNeighbor(corner, PREVIOUS)];
        const next = corners[getNeighbor(corner, NEXT)];
        const opposite = corners[getNeighbor(corner, OPPOSITE)];
        const turns = [
            (at: Point2d) => turn(opposite, previous, at),
            (at: Point2d) => turn(previous, at, next),
            (at: Point2d) => turn(at, next, opposite),
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

    /**
     * Where a point in front of a viewer is drawn on screen, as CSS `perspective()` draws it.
     *
     * @param point The point, in pixels from the middle of the box: across, down, and towards the viewer.
     * @param perspectivePx How far away the viewer sits, in pixels.
     * @returns The point on screen, in pixels from the middle of the box, or `undefined` when it is level with the
     * viewer or behind them, where nothing can be drawn.
     */
    export const project = (point: Point3d, perspectivePx: number): Point2d | undefined => {
        const depth = perspectivePx - point.z;

        if (depth <= NOTHING) return undefined;

        return { x: (point.x * perspectivePx) / depth, y: (point.y * perspectivePx) / depth };
    };
}
