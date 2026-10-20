import { type Point2d, Point2dUtils } from "./point2d.js";
import type { Size2d } from "./size.js";

/** A corner of a {@link Quad}. */
export type QuadCorner = "top_left" | "top_right" | "bottom_right" | "bottom_left";

/**
 * A four-sided shape given by where each of its corners is.
 *
 * The corners are named after the corners of the box the shape started as, wherever they have since been moved,
 * so `top_left` is still the one that started top left.
 */
export type Quad = Record<QuadCorner, Point2d>;

const ORDER: readonly QuadCorner[] = ["top_left", "top_right", "bottom_right", "bottom_left"];

const getSquareMap = (quad: Quad) => {
    const { top_left: p0, top_right: p1, bottom_right: p2, bottom_left: p3 } = quad;
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

/** Checking, scaling and drawing {@link Quad} shapes. */
export namespace QuadUtils {
    /** The four corners, clockwise on screen from the top left. */
    export const CORNERS = ORDER;

    /**
     * Finds the corner a number of steps clockwise round the shape from another.
     *
     * @param corner Where to start.
     * @param steps How many corners on, clockwise. Negative steps go the other way, and any number of whole laps
     * comes back round.
     */
    export const getNeighbor = (corner: QuadCorner, steps: number) =>
        ORDER[(((ORDER.indexOf(corner) + steps) % ORDER.length) + ORDER.length) % ORDER.length];

    /**
     * Tests whether a shape can be drawn by stretching a box onto it: every corner turns the same way, clockwise
     * on screen, so no edge crosses another and no corner sits on the line between its neighbors.
     *
     * @param quad The corners, in any one unit.
     */
    export const getIsConvex = (quad: Quad) =>
        ORDER.every(
            (corner) =>
                Point2dUtils.getCornerTurn(quad[getNeighbor(corner, -1)], quad[corner], quad[getNeighbor(corner, 1)]) >
                0,
        );

    /**
     * Stretches a shape given in shares of a box into that box's units.
     *
     * @param quad The corners, `0` to `1` across each axis of the box, and beyond it past the box's edges.
     * @param size The box.
     * @returns The corners measured from the box's top left.
     */
    export const scale = (quad: Quad, size: Size2d): Quad => ({
        top_left: { x: quad.top_left.x * size.width, y: quad.top_left.y * size.height },
        top_right: { x: quad.top_right.x * size.width, y: quad.top_right.y * size.height },
        bottom_right: { x: quad.bottom_right.x * size.width, y: quad.bottom_right.y * size.height },
        bottom_left: { x: quad.bottom_left.x * size.width, y: quad.bottom_left.y * size.height },
    });

    /**
     * Finds where a point of a box lands once the box is stretched onto a shape.
     *
     * The box is stretched as a flat sheet seen in perspective, the way {@link toCss} draws it, so straight lines
     * inside it stay straight.
     *
     * @param size The box.
     * @param quad Where its corners go, measured from its own top left.
     * @param p The point, measured from the box's top left before it is stretched.
     * @returns Where it lands, or `undefined` when the shape is not {@link getIsConvex} or the box has no size.
     */
    export const mapPoint = (size: Size2d, quad: Quad, p: Point2d): Point2d | undefined => {
        if (size.width <= 0 || size.height <= 0 || !getIsConvex(quad)) return undefined;

        const { a, b, c, d, e, f, g, h } = getSquareMap(quad);
        const u = p.x / size.width;
        const v = p.y / size.height;
        const w = g * u + h * v + 1;

        return { x: (a * u + b * v + c) / w, y: (d * u + e * v + f) / w };
    };

    /**
     * Writes the CSS `transform` that stretches an element so its corners land on a shape.
     *
     * The element is stretched as a flat sheet seen in perspective, so straight lines inside it stay straight and
     * the half nearer a pulled-in corner is squeezed, as a sheet tipped away would be. **It needs
     * `transform-origin: 0 0` on the element**, since the corners are measured from its own top left.
     *
     * @param size The element's own size, in pixels, before it is stretched.
     * @param quad Where its corners go, in pixels from its own top left.
     * @returns A `matrix3d(…)` value, or `undefined` when the shape is not {@link getIsConvex} or the element has
     * no size.
     */
    export const toCss = (size: Size2d, quad: Quad) => {
        if (size.width <= 0 || size.height <= 0 || !getIsConvex(quad)) return undefined;

        const { a, b, c, d, e, f, g, h } = getSquareMap(quad);
        const across = 1 / size.width;
        const down = 1 / size.height;

        return `matrix3d(${a * across}, ${d * across}, 0, ${g * across}, ${b * down}, ${e * down}, 0, ${h * down}, 0, 0, 1, 0, ${c}, ${f}, 0, 1)`;
    };
}
