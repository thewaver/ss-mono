import type { Point2d } from "@thewaver/ss-utils";

import type {
    PlacementLayout,
    PlacementPickDefs,
    PlacementPickRule,
    PlacementRect,
    PlacementSector,
} from "./Placement.types";

const NOTHING = 0;
const HALF = 0.5;
const PERCENT = 100;
const FULL_WIDTH = 1;
const DEFAULT_PICK_RULE: PlacementPickRule = "nearest";
const HALF_TURN_DEGREES = 180;
const FULL_TURN_DEGREES = 360;
const NO_DIRECTION_RADIUS = 1e-6;
const DEGREES_PER_RADIAN = 180 / Math.PI;
const LARGE_ARC = 1;
const SMALL_ARC = 0;
const CLOCKWISE = 1;
const COUNTER_CLOCKWISE = 0;
const FIRST_INDEX = 0;
const SINGLE_STEP = 1;
const PAIR = 2;

/** How far it is from a rectangle's centre to its border in a given direction, taking the rectangle's own rotation into account. */
const toBorderDistance = (rect: PlacementRect, direction: Point2d) => {
    const radians = (rect.angle ?? NOTHING) / DEGREES_PER_RADIAN;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const along = Math.abs(direction.x * cos + direction.y * sin);
    const across = Math.abs(-direction.x * sin + direction.y * cos);
    const toEdge = (extent: number, share: number) =>
        share < NO_DIRECTION_RADIUS ? Infinity : (extent * HALF) / share;

    return Math.min(toEdge(rect.width, along), toEdge(rect.height, across));
};

/** How wide a rotated rectangle's shadow is when measured along a given direction. */
const toExtentAcross = (rect: PlacementRect, direction: Point2d) => {
    const radians = (rect.angle ?? NOTHING) / DEGREES_PER_RADIAN;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    return (
        Math.abs(direction.x * cos + direction.y * sin) * rect.width +
        Math.abs(-direction.x * sin + direction.y * cos) * rect.height
    );
};

/** The bearing from one point to another, in degrees, zero pointing right and increasing clockwise. */
const toAngle = (from: Point2d, to: Point2d) =>
    (Math.atan2(to.y - from.y, to.x - from.x) * HALF_TURN_DEGREES) / Math.PI;

/** The straight-line distance between two points. */
const toDistance = (from: Point2d, to: Point2d) => Math.hypot(from.x - to.x, from.y - to.y);

/** The centre of the circle through three points, or `undefined` when they are in a line. */
const toCircumcentre = (first: Point2d, second: Point2d, third: Point2d): Point2d | undefined => {
    const twiceArea =
        PAIR * (first.x * (second.y - third.y) + second.x * (third.y - first.y) + third.x * (first.y - second.y));

    if (Math.abs(twiceArea) < NO_DIRECTION_RADIUS) return undefined;

    const square = (point: Point2d) => point.x * point.x + point.y * point.y;

    return {
        x:
            (square(first) * (second.y - third.y) +
                square(second) * (third.y - first.y) +
                square(third) * (first.y - second.y)) /
            twiceArea,
        y:
            (square(first) * (third.x - second.x) +
                square(second) * (first.x - third.x) +
                square(third) * (second.x - first.x)) /
            twiceArea,
    };
};

/**
 * Extends a run of three points by one more, following the curve they describe.
 *
 * Fitting a circle to the three and stepping the same angle again gives a point that continues an
 * arc as an arc and a straight line as a straight line, which is what a phantom neighbour past the
 * end of a ring or a row needs to be.
 */
const toContinuedCentre = (beyond: Point2d, near: Point2d, from: Point2d): Point2d => {
    const alongTheLine = { x: from.x + (from.x - near.x), y: from.y + (from.y - near.y) };
    const centre = toCircumcentre(beyond, near, from);

    if (centre === undefined) return alongTheLine;

    const bearing = toAngle(centre, from);
    const turned = bearing - toAngle(centre, near);
    const step =
        ((((turned + HALF_TURN_DEGREES) % FULL_TURN_DEGREES) + FULL_TURN_DEGREES) % FULL_TURN_DEGREES) -
        HALF_TURN_DEGREES;
    const radius = toDistance(centre, from);
    const radians = (bearing + step) / DEGREES_PER_RADIAN;

    return { x: centre.x + Math.cos(radians) * radius, y: centre.y + Math.sin(radians) * radius };
};

/**
 * Positions items along an arbitrary layout — a row, a ring, a spiral, a tree — and answers
 * questions about the result.
 *
 * A layout is a plain list of rectangles produced by a layout function, so the components built on
 * this do not know or care what shape they are drawing. What is provided here is everything that
 * has to work regardless of shape: the SVG paths for wedges and connecting links, the gap between
 * two neighbours, and which item a point is aimed at.
 *
 * Positions are fractions of the container's width rather than pixels, and vertical positions are
 * scaled by the layout's own height ratio, which is what lets one layout describe a shape that
 * keeps its proportions at any size. A rectangle's `left` and `top` are its centre, not its corner.
 */
export namespace PlacementUtils {
    /**
     * The point a layout radiates from.
     *
     * Layouts with a centre — rings, wedges, spirals — name it; the rest get the middle of the
     * container, which is where an angle-based pick will measure from.
     */
    export const getOrigin = (layout: PlacementLayout): Point2d =>
        layout.origin ?? { x: FULL_WIDTH * HALF, y: layout.heightRatio * HALF };

    /**
     * Writes a fraction of the container's width as a CSS length.
     *
     * Container units rather than percentages, so every measurement in a layout — vertical ones
     * included — is relative to the same edge and the shape does not distort as the container changes
     * proportion.
     *
     * @param ratio The fraction, where `1` is the full width.
     */
    export const toContainerWidth = (ratio: number) => `${ratio * PERCENT}cqw`;

    /**
     * Converts a point given as fractions of a box into layout coordinates.
     *
     * @param boxRatio The point, `0` to `1` on each axis.
     * @param heightRatio The layout's height as a fraction of its width.
     * @returns The point with its vertical part scaled into the layout's own space, so it can be
     * compared against placements.
     */
    export const toLayoutPoint = (boxRatio: Point2d, heightRatio: number): Point2d => ({
        x: boxRatio.x,
        y: boxRatio.y * heightRatio,
    });

    /** A placement's centre. Its `left` and `top` already name the centre rather than a corner, so this is only a change of vocabulary. */
    export const getCentre = (placement: PlacementRect): Point2d => ({ x: placement.left, y: placement.top });

    /**
     * Builds the SVG path for a wedge or a ring segment.
     *
     * @param sector The wedge: its two radii and the angles it spans, clockwise from pointing right.
     * @param origin Overrides the wedge's own centre, for drawing several wedges about one point.
     * @returns A closed path. A wedge with no inner radius is drawn as a pie slice from the centre; one
     * with an inner radius is drawn as a ring segment, out along one edge and back along the other.
     */
    export const getSectorPath = (sector: PlacementSector, origin?: Point2d) => {
        const centre = origin ?? sector.origin ?? { x: FULL_WIDTH * HALF, y: FULL_WIDTH * HALF };
        const { innerRadius, outerRadius, fromAngle, toAngle } = sector;
        const sweep = toAngle - fromAngle > HALF_TURN_DEGREES ? LARGE_ARC : SMALL_ARC;
        const at = (radius: number, angle: number) => {
            const radians = angle / DEGREES_PER_RADIAN;

            return `${centre.x + Math.cos(radians) * radius} ${centre.y + Math.sin(radians) * radius}`;
        };

        if (innerRadius <= NOTHING) {
            return [
                `M ${centre.x} ${centre.y}`,
                `L ${at(outerRadius, fromAngle)}`,
                `A ${outerRadius} ${outerRadius} 0 ${sweep} ${CLOCKWISE} ${at(outerRadius, toAngle)}`,
                "Z",
            ].join(" ");
        }

        return [
            `M ${at(outerRadius, fromAngle)}`,
            `A ${outerRadius} ${outerRadius} 0 ${sweep} ${CLOCKWISE} ${at(outerRadius, toAngle)}`,
            `L ${at(innerRadius, toAngle)}`,
            `A ${innerRadius} ${innerRadius} 0 ${sweep} ${COUNTER_CLOCKWISE} ${at(innerRadius, fromAngle)}`,
            "Z",
        ].join(" ");
    };

    /**
     * Builds the SVG path connecting two placements.
     *
     * @param from The placement the link starts at.
     * @param to The placement it ends at.
     * @param origin The point the layout curves about. Without one the link is a straight line, which
     * is right for a row or a tree.
     * @param radii Overrides the arc's radii, for an elliptical layout. Taken from the distance to the
     * origin when omitted.
     * @returns A path holding one line or one arc. The arc takes the shorter way round, so a link never
     * sweeps the long way across a ring.
     */
    export const getLinkPath = (from: PlacementRect, to: PlacementRect, origin?: Point2d, radii?: Point2d) => {
        const start = getCentre(from);
        const end = getCentre(to);
        const move = `M ${start.x} ${start.y}`;

        if (origin === undefined) return `${move} L ${end.x} ${end.y}`;

        const radiusX = radii?.x ?? getDistance(origin, start);
        const radiusY = radii?.y ?? radiusX;
        const turned = getAngle(origin, end) - getAngle(origin, start);
        const wrapped = ((turned % FULL_TURN_DEGREES) + FULL_TURN_DEGREES) % FULL_TURN_DEGREES;
        const isClockwise = wrapped <= HALF_TURN_DEGREES;
        const sweep = isClockwise ? CLOCKWISE : COUNTER_CLOCKWISE;
        const arc = isClockwise ? wrapped : FULL_TURN_DEGREES - wrapped;

        return `${move} A ${radiusX} ${radiusY} 0 ${arc > HALF_TURN_DEGREES ? LARGE_ARC : SMALL_ARC} ${sweep} ${end.x} ${end.y}`;
    };

    /**
     * The bearing from one point to another.
     *
     * @returns Degrees, zero pointing right and increasing clockwise, from `-180` to `180`.
     */
    export const getAngle = toAngle;

    /**
     * How far apart two bearings are, whichever way round they were given.
     *
     * @returns The separation in degrees, from `0` to `180`. `350` and `10` are twenty degrees apart,
     * not three hundred and forty.
     */
    export const getAngleDelta = (a: number, b: number) => {
        const wrapped = (((a - b + HALF_TURN_DEGREES) % FULL_TURN_DEGREES) + FULL_TURN_DEGREES) % FULL_TURN_DEGREES;
        const delta = wrapped - HALF_TURN_DEGREES;

        return Math.abs(delta);
    };

    /** The straight-line distance between two points. */
    export const getDistance = toDistance;

    /**
     * The space between two neighbouring placements, as a placement of its own.
     *
     * This is what a drop indicator is drawn in. The gap is measured from border to border rather than
     * centre to centre, so it lands in the space actually between the two items whatever their sizes,
     * and it is rotated to lie along the run — which for a ring means each gap is tilted like the items
     * around it.
     *
     * The ends are handled by inventing a neighbour just past them, placed by continuing the curve the
     * last three items describe. That gives the gap before the first item and after the last one the
     * same size and tilt as the ones in between, rather than a special case that looks wrong on a ring.
     *
     * @param placements The layout's placements, in order.
     * @param index The gap to measure: `0` is before the first item, `placements.length` is after the
     * last.
     * @returns The gap, or `undefined` when there are fewer than two placements or the two neighbours
     * sit on top of each other.
     */
    export const getGapPlacement = (placements: PlacementRect[], index: number): PlacementRect | undefined => {
        if (placements.length < PAIR) return undefined;

        const last = placements.length - SINGLE_STEP;
        const at = (position: number) => placements[position];
        const phantomOf = (from: number, near: number, beyond: number): PlacementRect => {
            const centre = toContinuedCentre(getCentre(at(beyond)), getCentre(at(near)), getCentre(at(from)));

            return { ...at(from), left: centre.x, top: centre.y };
        };

        const isBeforeFirst = index <= FIRST_INDEX;
        const isAfterLast = index > last;
        const anchor = isBeforeFirst
            ? phantomOf(FIRST_INDEX, SINGLE_STEP, PAIR)
            : at(Math.min(index, last + SINGLE_STEP) - SINGLE_STEP);
        const neighbour = isAfterLast
            ? phantomOf(last, last - SINGLE_STEP, last - PAIR)
            : at(isBeforeFirst ? FIRST_INDEX : index);

        const from = getCentre(anchor);
        const to = getCentre(neighbour);
        const span = { x: to.x - from.x, y: to.y - from.y };
        const length = Math.hypot(span.x, span.y);

        if (length < NO_DIRECTION_RADIUS) return undefined;

        const forward = { x: span.x / length, y: span.y / length };
        const backward = { x: -forward.x, y: -forward.y };
        const across = { x: -forward.y, y: forward.x };

        const near = toBorderDistance(anchor, forward);
        const far = length - toBorderDistance(neighbour, backward);
        const centre = {
            x: from.x + forward.x * (near + far) * HALF,
            y: from.y + forward.y * (near + far) * HALF,
        };

        return {
            left: centre.x,
            top: centre.y,
            width: Math.max(far - near, NOTHING),
            height: Math.min(toExtentAcross(anchor, across), toExtentAcross(neighbour, across)),
            angle: (Math.atan2(forward.y, forward.x) * HALF_TURN_DEGREES) / Math.PI,
        };
    };

    /**
     * Which item a point is aimed at.
     *
     * Two rules, because two shapes need different answers. `"nearest"` takes the closest centre, which
     * is right for a row or a grid. `"angle"` takes the item whose bearing from the layout's origin is
     * closest, which is right for a ring or a wheel — there, a point far outside the ring is still
     * plainly aimed at one of them, and distance would pick badly or not at all.
     *
     * @param defs.layout The layout to pick from.
     * @param defs.point The point being aimed, in layout coordinates.
     * @param defs.isPickable Excludes items — a disabled option, a gap. Everything is pickable when
     * omitted.
     * @returns The item's index, or `undefined` when nothing is pickable, or when the angle rule is in
     * use and the point sits on the origin, where it has no bearing.
     */
    export const pickIndex = (defs: PlacementPickDefs) => {
        const { placements } = defs.layout;
        const rule = defs.layout.pickRule ?? DEFAULT_PICK_RULE;
        const origin = getOrigin(defs.layout);
        const isPickable = defs.isPickable ?? (() => true);

        if (rule === "angle" && getDistance(defs.point, origin) < NO_DIRECTION_RADIUS) return undefined;

        let bestIndex: number | undefined;
        let bestScore = Infinity;

        for (let index = NOTHING; index < placements.length; index++) {
            if (!isPickable(index)) continue;

            const centre = getCentre(placements[index]);

            if (rule === "angle" && getDistance(centre, origin) < NO_DIRECTION_RADIUS) continue;

            const score =
                rule === "angle"
                    ? getAngleDelta(getAngle(origin, defs.point), getAngle(origin, centre))
                    : getDistance(defs.point, centre);

            if (score >= bestScore) continue;

            bestScore = score;
            bestIndex = index;
        }

        return bestIndex;
    };
}
