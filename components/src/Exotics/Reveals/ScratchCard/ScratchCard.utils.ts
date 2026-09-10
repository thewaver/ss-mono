import { type Point2d, type Rect, ShapeUtils, type Size2d } from "@thewaver/ss-utils";

import type { ScratchCardBrushShape } from "./ScratchCard.types";

/** Zero, as a count or a ratio. */
const NOTHING = 0;
/** Halfway, for taking a sample from the middle of its cell. */
const HALF = 0.5;
/** Asks the shape builder for an outline only, with no stroked edges. */
const NO_EDGE_THICKNESSES = [0];
/** The brush shape when the caller has not described one. */
const CIRCLE_CLIP_PATH = "circle(50%)";
/** How many standard deviations of blur cover the brush's radius, which is what converts a softness into a blur amount. */
const BLUR_SPREAD = 3;
/** Decimal places kept in a stamp's path. One is beyond what a screen can show, and the paths accumulate. */
const COORDINATE_DIGITS = 1;

/**
 * Draws the brush strokes that scratch a covering away, and measures how much is gone.
 *
 * The covering is scratched by stamping the brush shape along the pointer's path, so the marks
 * accumulate as one growing region. How much has been cleared is answered by sampling a grid of
 * points and asking how many of them fall inside that region, which is cheap and does not need the
 * pixels read back.
 */
export namespace ScratchCardUtils {
    /**
     * The brush's outline, in its own coordinates.
     *
     * @param shape The brush: its radius, and a function describing its outline.
     * @returns The points, or `undefined` for a brush that has no outline of its own and should be
     * drawn as a circle.
     */
    export const computeBrushPoints = (shape: ScratchCardBrushShape) =>
        shape.computePoints?.({ width: shape.radius * 2, height: shape.radius * 2 });

    /**
     * The brush shape as a CSS clip path, for drawing the cursor.
     *
     * @param shape The brush.
     * @returns A path, or a circle for a brush with no outline of its own.
     */
    export const computeBrushClipPath = (shape: ScratchCardBrushShape) => {
        const points = computeBrushPoints(shape);

        if (!points) return CIRCLE_CLIP_PATH;

        return `path("${ShapeUtils.getPaths(points, NO_EDGE_THICKNESSES, shape.joinRadii, shape.lameExponents).outerPath}")`;
    };

    /**
     * The square a brush stamp occupies.
     *
     * @param point The brush's centre.
     * @param radius The brush's radius.
     */
    export const computeBrushBox = (point: Point2d, radius: number): Rect => ({
        x: point.x - radius,
        y: point.y - radius,
        width: radius * 2,
        height: radius * 2,
    });

    /**
     * How much to blur a stamp's edge for a given softness.
     *
     * @param radius The brush's radius, which the blur is scaled against so softness means the same at
     * any brush size.
     * @param softness `0` for a hard edge, `1` for as soft as the brush is wide.
     * @returns The blur's standard deviation.
     */
    export const computeBlurDeviation = (radius: number, softness: number) => ((1 - softness) * radius) / BLUR_SPREAD;

    /**
     * One brush stamp as an SVG path.
     *
     * Coordinates are rounded, because a scratch accumulates hundreds of these and the path string is
     * what the browser has to reparse each time.
     *
     * @param point Where to stamp.
     * @param radius The brush's radius.
     * @param points The brush's outline. Without one, two arcs are used to draw a circle — a single arc
     * cannot describe a full circle, since its start and end would coincide.
     */
    export const computeStampPath = (point: Point2d, radius: number, points: Point2d[] | undefined) => {
        const at = (value: number) => value.toFixed(COORDINATE_DIGITS);

        if (!points) {
            const left = at(point.x - radius);
            const right = at(point.x + radius);
            const y = at(point.y);

            return `M${left} ${y}A${radius} ${radius} 0 1 0 ${right} ${y}A${radius} ${radius} 0 1 0 ${left} ${y}Z`;
        }

        const offset = { x: point.x - radius, y: point.y - radius };
        const [first, ...rest] = points;
        const start = `M${at(first.x + offset.x)} ${at(first.y + offset.y)}`;

        return rest.reduce((d, p) => `${d}L${at(p.x + offset.x)} ${at(p.y + offset.y)}`, start) + "Z";
    };

    /**
     * Five points to test a stamp against, for deciding whether it cleared anything new.
     *
     * The centre and the four extremes rather than the whole area: enough to tell a stamp landing on
     * fresh covering from one retracing ground already cleared, at a fraction of the cost.
     *
     * @param point The brush's centre.
     * @param radius The brush's radius.
     */
    export const computeProbePoints = (point: Point2d, radius: number): Point2d[] => [
        point,
        { x: point.x + radius, y: point.y },
        { x: point.x - radius, y: point.y },
        { x: point.x, y: point.y + radius },
        { x: point.x, y: point.y - radius },
    ];

    /**
     * An evenly spaced grid of points to measure how much has been cleared.
     *
     * Points sit at the centre of their cells rather than on the boundaries, so the edges of the card
     * are weighted like everywhere else.
     *
     * @param size The card's size.
     * @param precision How many points along each axis. The total is its square, so the cost rises
     * quickly — this is the dial between an accurate reading and a cheap one.
     */
    export const computeSamplePoints = (size: Size2d, precision: number): Point2d[] => {
        const side = Math.max(Math.round(precision), 1);
        const points: Point2d[] = [];

        for (let row = NOTHING; row < side; row++) {
            for (let column = NOTHING; column < side; column++) {
                points.push({ x: ((column + HALF) * size.width) / side, y: ((row + HALF) * size.height) / side });
            }
        }

        return points;
    };

    /**
     * How much of the card has been scratched away.
     *
     * @param insideCount How many sample points fall within the scratched region.
     * @param sampleCount How many points were tested.
     * @returns A fraction from `0` to `1`, or `0` when nothing was sampled.
     */
    export const computeClearedRatio = (insideCount: number, sampleCount: number) =>
        sampleCount > NOTHING ? Math.min(insideCount / sampleCount, 1) : NOTHING;
}
