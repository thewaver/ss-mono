import { MathUtils } from "./math.js";
import { Point2d, Point2dUtils } from "./point2d.js";

const PARALLEL_EPSILON = 1e-12;
const RAY_START_EPSILON = 1e-9;
const EDGE_RATIO_EPSILON = 1e-9;

/**
 * A point on a polygon's contour, and where along the contour it lies.
 *
 * `edgeIndex` names the edge that runs from corner `edgeIndex` to the corner after it, and `edgeRatio` says how
 * far along that edge the point lies, from `0` at its first corner to `1` at its second.
 */
export type PolygonContourPoint = {
    point: Point2d;
    edgeIndex: number;
    edgeRatio: number;
};

/**
 * Where a ray first meets a polygon's contour, as {@link PolygonUtils.castRay} reports it.
 *
 * Placed on the contour as a {@link PolygonContourPoint} is. `distance` is measured in multiples of the direction the
 * ray was cast with, so it is in pixels only for a direction of length 1.
 */
export type PolygonCrossing = PolygonContourPoint & {
    distance: number;
};

export namespace PolygonUtils {
    /**
     * Formats points for an SVG `points` attribute, as in `"0,0 10,0 10,10"`.
     *
     * @param pts The corners, in order.
     */
    export const pointsToSVGString = (pts: Point2d[]) => pts.map((p) => `${p.x},${p.y}`).join(" ");

    /**
     * Finds the unit-length direction sticking out at right angles from an edge.
     *
     * Which of the two sides it points to depends on the order of the corners, so keep
     * a consistent winding direction around the shape.
     *
     * @param p1 Start of the edge.
     * @param p2 End of the edge.
     * @returns A direction of length 1. Two identical points give `NaN`, since a
     * zero-length edge has no sides.
     */
    export const getEdgeNormal = (p1: Point2d, p2: Point2d) => {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const len = Math.hypot(dx, dy);

        return {
            x: -dy / len,
            y: dx / len,
        };
    };

    /**
     * Finds where two infinite lines cross.
     *
     * Each line is given as a point plus the direction it runs in. The lines are
     * unbounded, so the crossing may land outside either stretch.
     *
     * @param p1 Any point on the first line.
     * @param dir1 Which way the first line runs.
     * @param p2 Any point on the second line.
     * @param dir2 Which way the second line runs.
     * @returns Where they cross, or `p2` if the lines run parallel and never meet.
     */
    export const getLineIntersection = (p1: Point2d, dir1: Point2d, p2: Point2d, dir2: Point2d): Point2d =>
        Point2dUtils.intersectLines(p1, dir1, p2, dir2, 1e-6);

    /**
     * Pushes every edge of a polygon inwards (or outwards) by the same amount.
     *
     * Each edge is shifted sideways and neighboring edges are extended until they
     * meet, so corners stay sharp rather than getting rounded off. Shifting further
     * than a shape can take will make thin parts turn inside out.
     *
     * @param pts The corners, in order. Never modified.
     * @param shift How far to move each edge. The sign that means "inwards" depends on
     * whether the corners run clockwise or counterclockwise.
     * @returns A new array with one corner per input corner.
     */
    export function insetPolygon(pts: Point2d[], shift: number): Point2d[] {
        const count = pts.length;
        const result: Point2d[] = [];

        for (let i = 0; i < count; i++) {
            const prev = pts[(i - 1 + count) % count];
            const curr = pts[i];
            const next = pts[(i + 1) % count];

            const n1 = getEdgeNormal(prev, curr);
            const n2 = getEdgeNormal(curr, next);

            const p1 = {
                x: prev.x + n1.x * shift,
                y: prev.y + n1.y * shift,
            };
            const p2 = {
                x: curr.x + n1.x * shift,
                y: curr.y + n1.y * shift,
            };
            const p3 = {
                x: curr.x + n2.x * shift,
                y: curr.y + n2.y * shift,
            };
            const p4 = {
                x: next.x + n2.x * shift,
                y: next.y + n2.y * shift,
            };

            const d1 = { x: p2.x - p1.x, y: p2.y - p1.y };
            const d2 = { x: p4.x - p3.x, y: p4.y - p3.y };

            result.push(getLineIntersection(p1, d1, p3, d2));
        }

        return result;
    }

    /**
     * Measures the area a polygon encloses, signed by which way its corners run.
     *
     * The sign is what makes it useful beyond the area itself: two polygons whose corners run the same way give
     * areas of the same sign, so comparing signed areas tells a polygon from the one its edges would trace if a
     * stretch of it were walked the wrong way round.
     *
     * @param pts The corners, in order.
     * @returns Positive when the corners run clockwise on screen (y pointing down), negative when they run the other
     * way, and `0` for fewer than three corners.
     */
    export const getSignedArea = (pts: Point2d[]) => {
        let sum = 0;

        for (let i = 0; i < pts.length; i++) {
            const curr = pts[i];
            const next = pts[(i + 1) % pts.length];

            sum += curr.x * next.y - next.x * curr.y;
        }

        return sum * 0.5;
    };

    /**
     * Whether a point lies inside a polygon.
     *
     * Counts how many edges a line running right from the point crosses, so it works for any polygon whose edges do
     * not cross each other, dents included. A point exactly on an edge may land either way.
     *
     * @param pts The corners, in order. Either winding.
     * @param point The point to test.
     */
    export const getIsPointInside = (pts: Point2d[], point: Point2d) => {
        let isInside = false;

        for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
            const a = pts[i];
            const b = pts[j];

            if (a.y > point.y !== b.y > point.y && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x) {
                isInside = !isInside;
            }
        }

        return isInside;
    };

    /**
     * Finds the point on a polygon's contour nearest to a given point.
     *
     * The contour is the closed run of edges, so the answer may sit anywhere along an edge, not only at a corner, and
     * a point already on the contour comes back unchanged.
     *
     * @param pts The corners, in order.
     * @param point The point to move onto the contour. It may be inside, outside or on it.
     * @returns The nearest contour point with the edge it lies on, or a copy of `point` on edge `0` when there are no
     * corners to measure against. A point exactly on a corner is reported on the edge that ends there.
     */
    export const getNearestContourPoint = (pts: Point2d[], point: Point2d): PolygonContourPoint => {
        let best: PolygonContourPoint = { point: { ...point }, edgeIndex: 0, edgeRatio: 0 };
        let bestDistance = Infinity;

        for (let i = 0; i < pts.length; i++) {
            const a = pts[i];
            const b = pts[(i + 1) % pts.length];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const lengthSq = dx * dx + dy * dy;
            const ratio = lengthSq ? MathUtils.clamp01(((point.x - a.x) * dx + (point.y - a.y) * dy) / lengthSq) : 0;
            const candidate = { x: a.x + dx * ratio, y: a.y + dy * ratio };
            const distance = Math.hypot(candidate.x - point.x, candidate.y - point.y);

            if (distance < bestDistance) {
                best = { point: candidate, edgeIndex: i, edgeRatio: ratio };
                bestDistance = distance;
            }
        }

        return best;
    };

    /**
     * Finds where a ray first meets a polygon's contour.
     *
     * The ray starts at `origin` and runs one way only, in `direction`. Of every edge it crosses, the nearest crossing
     * is the one reported, so a ray from outside a polygon reports where it enters, and one from inside reports where
     * it leaves. An edge running exactly along the ray is never counted as crossed.
     *
     * @param pts The corners, in order.
     * @param origin Where the ray starts. A crossing at the origin itself is not counted.
     * @param direction Which way the ray runs. Its length only scales the reported `distance`.
     * @returns The first crossing, or `undefined` when the ray misses the contour altogether.
     */
    export const castRay = (pts: Point2d[], origin: Point2d, direction: Point2d): PolygonCrossing | undefined => {
        let best: PolygonCrossing | undefined;

        for (let i = 0; i < pts.length; i++) {
            const a = pts[i];
            const b = pts[(i + 1) % pts.length];
            const edge = { x: b.x - a.x, y: b.y - a.y };
            const denominator = direction.x * edge.y - direction.y * edge.x;

            if (Math.abs(denominator) < PARALLEL_EPSILON) continue;

            const offset = { x: a.x - origin.x, y: a.y - origin.y };
            const distance = (offset.x * edge.y - offset.y * edge.x) / denominator;
            const edgeRatio = (offset.x * direction.y - offset.y * direction.x) / denominator;

            if (distance <= RAY_START_EPSILON) continue;
            if (edgeRatio < -EDGE_RATIO_EPSILON || edgeRatio > 1 + EDGE_RATIO_EPSILON) continue;
            if (best && distance >= best.distance) continue;

            best = {
                point: { x: origin.x + direction.x * distance, y: origin.y + direction.y * distance },
                edgeIndex: i,
                edgeRatio: MathUtils.clamp01(edgeRatio),
                distance,
            };
        }

        return best;
    };
}
