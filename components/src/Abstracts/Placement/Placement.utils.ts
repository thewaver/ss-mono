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

/**
 * How far the centre of a placement is from its own border along a direction, the placement being a box that
 * may be turned. The direction is taken into the box's own frame first, so the answer is the box's edge
 * rather than the edge of the upright rectangle it would have been.
 */
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

/** How wide a placement is across a direction, which for a turned box is not either of its two sides. */
const toExtentAcross = (rect: PlacementRect, direction: Point2d) => {
    const radians = (rect.angle ?? NOTHING) / DEGREES_PER_RADIAN;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    return (
        Math.abs(direction.x * cos + direction.y * sin) * rect.width +
        Math.abs(-direction.x * sin + direction.y * cos) * rect.height
    );
};

const toAngle = (from: Point2d, to: Point2d) =>
    (Math.atan2(to.y - from.y, to.x - from.x) * HALF_TURN_DEGREES) / Math.PI;

const toDistance = (from: Point2d, to: Point2d) => Math.hypot(from.x - to.x, from.y - to.y);

/**
 * The circle through three points, or nothing when they are in a line. Used to carry an arrangement one step
 * past its own end: three consecutive items say how the run is curving, and two say only which way it is
 * heading.
 */
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
 * Where the item past the end of a run would sit, had there been one. A run laid along a line continues along
 * it; a run laid round a circle continues round the circle by the same turn, which is what stops the gap at
 * the end of a ring being aimed as though the ring were straight. `beyond` may be the same point as `near`
 * when the run is only two long, in which case there is no curve to read and the line is all there is.
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

export namespace PlacementUtils {
    export const getOrigin = (layout: PlacementLayout): Point2d =>
        layout.origin ?? { x: FULL_WIDTH * HALF, y: layout.heightRatio * HALF };

    export const toContainerWidth = (ratio: number) => `${ratio * PERCENT}cqw`;

    export const toLayoutPoint = (boxRatio: Point2d, heightRatio: number): Point2d => ({
        x: boxRatio.x,
        y: boxRatio.y * heightRatio,
    });

    export const getCentre = (placement: PlacementRect): Point2d => ({ x: placement.left, y: placement.top });

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
     * The path from one placement to the next, for whatever draws the run between them. Straight by
     * default; given the point the two turn about, it bends along the arc they sit on instead, which is
     * what keeps a chain of steps on a curve from being drawn as a chain of chords.
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

    export const getAngle = toAngle;

    export const getAngleDelta = (a: number, b: number) => {
        const wrapped = (((a - b + HALF_TURN_DEGREES) % FULL_TURN_DEGREES) + FULL_TURN_DEGREES) % FULL_TURN_DEGREES;
        const delta = wrapped - HALF_TURN_DEGREES;

        return Math.abs(delta);
    };

    export const getDistance = toDistance;

    /**
     * Where the gap at an index sits, as a placement of its own — so whatever draws a landing mark is placed
     * the same way an item is. The gap is measured between the two borders that face each other rather than
     * between the two centres, which are the same point only while the neighbours are the same size, and it
     * is turned to lie across the line joining them so a mark reads as a mark rather than as a stray item.
     *
     * At either end of the list there is only one real neighbour, so the other is imagined by continuing the
     * arrangement one step further — see `toContinuedCentre`. Everything after that is the same arithmetic
     * the middle of the list uses, which is the point of doing it that way: there is one gap calculation,
     * not one for the middle and another for the ends.
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
