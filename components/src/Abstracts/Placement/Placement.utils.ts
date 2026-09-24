import { AngleUtils, type Point2d } from "@thewaver/ss-utils";

import type {
    PlacementLayout,
    PlacementPickDefs,
    PlacementPickRule,
    PlacementReach,
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
const LARGE_ARC = 1;
const SMALL_ARC = 0;
const CLOCKWISE = 1;
const COUNTER_CLOCKWISE = 0;
const FIRST_INDEX = 0;
const SINGLE_STEP = 1;
const PAIR = 2;

/** How far it is from a rectangle's center to its border in a given direction, taking the rectangle's own rotation into account. */
const toBorderDistance = (rect: PlacementRect, direction: Point2d) => {
    const radians = (rect.angle ?? NOTHING) * AngleUtils.RADIANS_PER_DEGREE;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const along = Math.abs(direction.x * cos + direction.y * sin);
    const across = Math.abs(-direction.x * sin + direction.y * cos);
    const toEdge = (extent: number, share: number) =>
        share < NO_DIRECTION_RADIUS ? Infinity : (extent * HALF) / share;

    return Math.min(toEdge(rect.widthShare, along), toEdge(rect.heightShare, across));
};

/** How wide a rotated rectangle's shadow is when measured along a given direction. */
const toExtentAcross = (rect: PlacementRect, direction: Point2d) => {
    const radians = (rect.angle ?? NOTHING) * AngleUtils.RADIANS_PER_DEGREE;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    return (
        Math.abs(direction.x * cos + direction.y * sin) * rect.widthShare +
        Math.abs(-direction.x * sin + direction.y * cos) * rect.heightShare
    );
};

/** The bearing from one point to another, in degrees, zero pointing right and increasing clockwise. */
const toAngle = (from: Point2d, to: Point2d) =>
    (Math.atan2(to.y - from.y, to.x - from.x) * HALF_TURN_DEGREES) / Math.PI;

/** The straight-line distance between two points. */
const toDistance = (from: Point2d, to: Point2d) => Math.hypot(from.x - to.x, from.y - to.y);

/** The center of the circle through three points, or `undefined` when they are in a line. */
const toCircumcenter = (first: Point2d, second: Point2d, third: Point2d): Point2d | undefined => {
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
 * arc as an arc and a straight line as a straight line, which is what a phantom neighbor past the
 * end of a ring or a row needs to be.
 */
/**
 * Extends a run of two points by one more, in a straight line.
 *
 * Reflecting the near point through the far one steps the same distance again along the line the two
 * describe, which is the only continuation two points have to offer. It is what {@link toContinuedCenter}
 * falls back to on a run of exactly two, where there is no third point to fit a circle to.
 */
const toMirroredCenter = (near: Point2d, from: Point2d): Point2d => ({
    x: from.x + (from.x - near.x),
    y: from.y + (from.y - near.y),
});

const toContinuedCenter = (beyond: Point2d, near: Point2d, from: Point2d): Point2d => {
    const alongTheLine = { x: from.x + (from.x - near.x), y: from.y + (from.y - near.y) };
    const center = toCircumcenter(beyond, near, from);

    if (center === undefined) return alongTheLine;

    const bearing = toAngle(center, from);
    const step = AngleUtils.getTurn(toAngle(center, near), bearing);
    const radius = toDistance(center, from);
    const radians = AngleUtils.toRadians(bearing + step);

    return { x: center.x + Math.cos(radians) * radius, y: center.y + Math.sin(radians) * radius };
};

/**
 * Positions items along an arbitrary layout — a row, a ring, a spiral, a tree — and answers
 * questions about the result.
 *
 * A layout is a plain list of rectangles produced by a layout function, so the components built on
 * this do not know or care what shape they are drawing. What is provided here is everything that
 * has to work regardless of shape: the SVG paths for wedges and connecting links, the gap between
 * two neighbors, and which item a point is aimed at.
 *
 * Positions are fractions of the container's width rather than pixels, and vertical positions are
 * scaled by the layout's own height ratio, which is what lets one layout describe a shape that
 * keeps its proportions at any size. A rectangle's `leftShare` and `topShare` are its center, not its corner.
 */
export namespace PlacementUtils {
    /**
     * The point a layout radiates from.
     *
     * Layouts with a center — rings, wedges, spirals — name it; the rest get the middle of the
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

    /** A placement's center. Its `leftShare` and `topShare` already name the center rather than a corner, so this is only a change of vocabulary. */
    export const getCenter = (placement: PlacementRect): Point2d => ({ x: placement.leftShare, y: placement.topShare });

    /**
     * How far a placement's border reaches from its center in a given direction.
     *
     * The placement's own rotation is taken into account, so a tilted box reports the distance to the
     * side that is actually facing that way. What this buys is a size-independent measure of nearness:
     * dividing a distance by it gives a number that is below `1` inside the box whatever the box's size
     * or proportion, which is the same vocabulary {@link PointerReading.edgeRatio} uses.
     *
     * @param placement The box being measured.
     * @param direction Which way to measure, as a unit vector.
     * @returns The distance in layout units, or `Infinity` where the direction has no length.
     */
    export const getBorderDistance = toBorderDistance;

    /**
     * How far apart two points are, the way this arrangement counts distance.
     *
     * A straight line is the wrong answer in most arrangements and it is not obvious until it is written
     * down. In a row, only the horizontal gap says anything — a pointer a long way above the row is still
     * next to the item it is above, and counting that vertical travel as distance makes the whole row go
     * quiet as the pointer drifts off it. In a ring, what separates two wedges is the turn between them
     * and nothing else, so the straight line across the middle makes the far side of the ring read as
     * near. Each arrangement names the rule it wants and everything measuring nearness in it — spacing,
     * an effect's reach — asks here rather than reaching for `hypot`.
     *
     * @param reach The arrangement's rule and, where the rule turns about something, its pivot. A
     * layout is itself one of these, so it can be passed whole.
     * @param from The point being measured from.
     * @param to The point being measured to.
     * @returns The distance in layout units, measured **along** the run — `"arc"` answers with the length
     * of the arc swept at the first point's own radius, so it stays comparable with every other length,
     * and how far off the band a point sits is {@link ProximityEffectDefs.radialShare}'s business rather
     * than this one's. It falls back to the straight line where either point sits on the pivot, having no
     * bearing there.
     */
    export const getReachDistance = (reach: PlacementReach, from: Point2d, to: Point2d) => {
        switch (reach.reachRule) {
            case "horizontal":
                return Math.abs(to.x - from.x);
            case "vertical":
                return Math.abs(to.y - from.y);
            case "arc": {
                const origin = reach.origin;

                if (origin === undefined) break;

                const radius = getDistance(origin, from);

                if (radius < NO_DIRECTION_RADIUS || getDistance(origin, to) < NO_DIRECTION_RADIUS) break;

                return (
                    radius * AngleUtils.toRadians(AngleUtils.getSeparation(toAngle(origin, from), toAngle(origin, to)))
                );
            }
        }

        return getDistance(from, to);
    };

    /**
     * How close the nearest item in a layout actually is to a point, the way the layout counts distance.
     *
     * {@link getReachDistance} answers for one item; a pointer effect needs to know whether the pointer is
     * near *any* item before it treats the space between them as something that grew. Without this, an
     * item far down a run reads the pointer's own raw distance as "everything between here and the pointer
     * already grew," even where the pointer sits well past the run's own end and nothing there ever did.
     *
     * @param layout The layout to measure against.
     * @param point The point being measured from.
     * @returns The smallest reach distance from `point` to any item's center, or `Infinity` where the
     * layout has no items.
     */
    export const getNearestReach = (layout: PlacementLayout, point: Point2d) =>
        layout.placements.reduce(
            (nearest, placement) => Math.min(nearest, getReachDistance(layout, getCenter(placement), point)),
            Infinity,
        );

    /**
     * How far an arrangement's items sit from the point it turns about.
     *
     * The middle of them rather than the largest, so a layout whose bands are at different radii reports
     * the one its items are mostly on.
     *
     * @param layout The arrangement to measure.
     * @returns The radius in layout units, or nothing where there are no items.
     */
    export const getRunRadius = (layout: PlacementLayout) => {
        const origin = getOrigin(layout);
        const radii = layout.placements
            .map((placement) => getDistance(origin, getCenter(placement)))
            .sort((a, b) => a - b);

        if (radii.length === NOTHING) return NOTHING;

        const middle = Math.floor(radii.length * HALF);

        return radii.length % PAIR === NOTHING ? (radii[middle - SINGLE_STEP] + radii[middle]) * HALF : radii[middle];
    };

    /**
     * How much room a turning run has left to spread into.
     *
     * A ring occupies the whole circle and can only pretend to make room for a growing item: push its
     * items along and the two directions travel round and pile into each other at the far side. An arc
     * has the rest of the circle to grow into, and a wide enough arc has almost none. Both are the same
     * measurement, which is what lets the answer be a clamp rather than a special case — a closed run is
     * simply one whose slack came out at nothing.
     *
     * The run's own width is counted as occupied along with the turn its items cover, since the far end
     * has to land somewhere. What is left over is reported as a length at the run's radius so it can be
     * compared against a push directly.
     *
     * @param layout The arrangement to measure.
     * @returns The free length in layout units, or `Infinity` where the run does not turn — a row has
     * ends and the page to grow into, and nothing here can say how far that is.
     */
    export const getRunSlack = (layout: PlacementLayout) => {
        if (layout.reachRule !== "arc" || layout.origin === undefined) return Infinity;

        const radius = getRunRadius(layout);
        const spacing = getSpacing(layout);

        if (radius < NO_DIRECTION_RADIUS) return NOTHING;

        const origin = getOrigin(layout);
        let covered = NOTHING;

        for (let index = SINGLE_STEP; index < layout.placements.length; index++) {
            covered += Math.abs(
                AngleUtils.getTurn(
                    toAngle(origin, getCenter(layout.placements[index - SINGLE_STEP])),
                    toAngle(origin, getCenter(layout.placements[index])),
                ),
            );
        }

        const occupied = covered * AngleUtils.RADIANS_PER_DEGREE * radius + spacing;

        return Math.max(FULL_TURN_DEGREES * AngleUtils.RADIANS_PER_DEGREE * radius - occupied, NOTHING);
    };

    /**
     * The bearing of the middle of a turning run.
     *
     * The circular mean of where its items lie, which for an arc is the direction it faces. What it is
     * for is deciding which way round the run one point lies from another: the shorter way round is the
     * obvious answer and it is ambiguous at exactly half a turn, which is not an edge case at all — a
     * half-turn arc's two ends are exactly that far apart, so the item at the far end took the opposite
     * way to its neighbor and the two collided. Unwrapping both bearings about the middle of the run
     * instead puts the ambiguity diametrically opposite that middle, which is off the run entirely for
     * any arrangement that does not close.
     *
     * @param layout The arrangement to measure.
     * @returns The bearing in degrees. A run that closes has no middle — its items cancel out — and
     * reports zero, which costs nothing, there being no way out of a loop to be wrong about.
     */
    export const getRunFacing = (layout: PlacementLayout) => {
        const origin = getOrigin(layout);
        let acrossSum = NOTHING;
        let downSum = NOTHING;

        for (const placement of layout.placements) {
            const radians = toAngle(origin, getCenter(placement)) * AngleUtils.RADIANS_PER_DEGREE;

            acrossSum += Math.cos(radians);
            downSum += Math.sin(radians);
        }

        return Math.hypot(acrossSum, downSum) < NO_DIRECTION_RADIUS
            ? NOTHING
            : Math.atan2(downSum, acrossSum) * AngleUtils.DEGREES_PER_RADIAN;
    };

    /**
     * How far a point sits past the run's own populated span, along the axis the rule measures by.
     *
     * {@link getNearestReach} cannot tell a point sitting in the gap between two real items from one
     * that has drifted past the run's own end — both read as "close to the nearest item," and a pointer
     * effect that reads nearness as "something here is growing" needs the two told apart. This is `0`
     * everywhere inside the run, where the gap to the nearest item is a real gap between real neighbors,
     * and grows only past the outermost item on whichever side the point has gone.
     *
     * @param layout The layout to measure against.
     * @param point The point being measured from.
     * @returns The reach distance from the point to the run's nearer edge, or `0` where the point falls
     * within the run's own span. A closed ring has no edge to be past and always answers `0`. A layout
     * with no reach rule has no single span to be inside or outside of, and falls back to
     * {@link getNearestReach}.
     */
    export const getRunOverreach = (layout: PlacementLayout, point: Point2d): number => {
        const { placements, reachRule } = layout;

        if (placements.length === NOTHING) return NOTHING;

        if (reachRule === "arc") {
            if (getRunSlack(layout) < NO_DIRECTION_RADIUS) return NOTHING;

            const origin = getOrigin(layout);
            const facing = getRunFacing(layout);
            const toTurn = (target: Point2d) => AngleUtils.getTurn(facing, toAngle(origin, target));
            const turns = placements.map((placement) => toTurn(getCenter(placement)));
            const pointTurn = toTurn(point);
            const minTurn = Math.min(...turns);
            const maxTurn = Math.max(...turns);
            const overshoot =
                pointTurn < minTurn ? minTurn - pointTurn : pointTurn > maxTurn ? pointTurn - maxTurn : NOTHING;

            return overshoot * AngleUtils.RADIANS_PER_DEGREE * getRunRadius(layout);
        }

        if (reachRule !== "horizontal" && reachRule !== "vertical") return getNearestReach(layout, point);

        const axis = reachRule === "horizontal" ? "x" : "y";
        const coords = placements.map((placement) => getCenter(placement)[axis]);
        const min = Math.min(...coords);
        const max = Math.max(...coords);
        const pointCoord = point[axis];

        return pointCoord < min ? min - pointCoord : pointCoord > max ? pointCoord - max : NOTHING;
    };

    /**
     * Whether a point is near enough to an arrangement to be measured against it at all.
     *
     * The companion question to {@link getReachDistance}, and the reason it is a separate one: a rule that
     * ignores an axis ignores it without limit, so a row measuring only the horizontal gap answers the same
     * whether the pointer is on it or a whole page above it, and would sit lit for as long as the pointer
     * was anywhere at that column. Being inside the layout's own box is therefore read once more as a yes
     * or a no, never as a distance, which costs nothing in the region that matters and stops at the edge.
     * Only the axis a rule measures along is left ungated, distance already limiting that one. `"plane"`
     * throws nothing away and so needs no gate at all: its distance is a straight line on both axes at
     * once, already falling toward nothing well before a pointer reaches the far side of the page, the same
     * way a row's own measured axis needs none. `"arc"` throws away the radius, which has no single axis to
     * test, so the whole box is the test — a wheel still answers a pointer outside its ring, and stops
     * answering one that has left the wheel.
     *
     * @param layout The arrangement being pointed at.
     * @param point The point, in layout coordinates.
     * @returns Whether it is near enough to count.
     */
    export const getIsWithinReach = (layout: PlacementLayout, point: Point2d) => {
        const isAcross = point.x >= NOTHING && point.x <= FULL_WIDTH;
        const isDown = point.y >= NOTHING && point.y <= layout.heightRatio;

        switch (layout.reachRule) {
            case "horizontal":
                return isDown;
            case "vertical":
                return isAcross;
            case "arc":
                return getDistance(getOrigin(layout), point) <= getRunRadius(layout) * PAIR;
            case "plane":
                return true;
        }

        return true;
    };

    /**
     * Which way one point lies from another, the way this arrangement counts direction.
     *
     * The companion to {@link getReachDistance} and the same rule read the other way: whatever the rule
     * ignores when it measures, it also refuses to move along. A row's items give way sideways however
     * far above them the pointer is, and a ring's turn about their own center rather than sliding across
     * the middle — which is what keeps a ring a ring when its items part.
     *
     * @param reach The arrangement's rule, pivot and the bearing of its middle, or a layout. Which way
     * round a turning run one point lies from another is read about that middle rather than by the
     * shorter way — see {@link getRunFacing} for why.
     * @param from The point being measured from.
     * @param to The point it is heading toward.
     * @returns A unit vector, or no direction at all where the two points are the same, or where they
     * differ only in what the rule ignores.
     */
    export const getReachBearing = (reach: PlacementReach, from: Point2d, to: Point2d): Point2d => {
        const step = { x: to.x - from.x, y: to.y - from.y };

        switch (reach.reachRule) {
            case "horizontal":
                return { x: Math.sign(step.x), y: NOTHING };
            case "vertical":
                return { x: NOTHING, y: Math.sign(step.y) };
            case "arc": {
                const origin = reach.origin;

                if (origin === undefined) break;

                const radius = { x: from.x - origin.x, y: from.y - origin.y };
                const length = Math.hypot(radius.x, radius.y);

                if (length < NO_DIRECTION_RADIUS) break;

                const tangent = { x: -radius.y / length, y: radius.x / length };
                const facing = reach.facing ?? NOTHING;
                const way = Math.sign(
                    AngleUtils.getTurn(facing, toAngle(origin, to)) - AngleUtils.getTurn(facing, toAngle(origin, from)),
                );

                return { x: tangent.x * way, y: tangent.y * way };
            }
        }

        const length = Math.hypot(step.x, step.y);

        return length < NO_DIRECTION_RADIUS ? { x: NOTHING, y: NOTHING } : { x: step.x / length, y: step.y / length };
    };

    /**
     * How far apart neighboring items sit in a layout.
     *
     * The middle of the distances between items that follow one another, rather than the average of
     * them, so one long jump — the step between a tree's tiers, the turn of a zigzag — does not drag the
     * answer away from what the run actually looks like. This is the yardstick a pointer effect wants:
     * "the two items either side of this one" is a statement about spacing, and expressing it in item
     * widths instead reads completely differently in an arrangement whose items overlap.
     *
     * Measured through {@link getReachDistance}, so a spacing and a reach compared against it are in the
     * same units whatever the arrangement.
     *
     * @param layout The layout to measure.
     * @returns The spacing in layout units. A layout of one item has no spacing to speak of and reports
     * that item's own width; an empty one reports nothing.
     */
    export const getSpacing = (layout: PlacementLayout) => {
        const { placements } = layout;

        if (placements.length < PAIR) return placements[FIRST_INDEX]?.widthShare ?? NOTHING;

        const steps: number[] = [];

        for (let index = SINGLE_STEP; index < placements.length; index++) {
            steps.push(
                getReachDistance(layout, getCenter(placements[index - SINGLE_STEP]), getCenter(placements[index])),
            );
        }

        steps.sort((a, b) => a - b);

        const middle = Math.floor(steps.length * HALF);

        return steps.length % PAIR === NOTHING ? (steps[middle - SINGLE_STEP] + steps[middle]) * HALF : steps[middle];
    };

    /**
     * Builds the SVG path for a wedge or a ring segment.
     *
     * @param sector The wedge: its two radii and the angles it spans, clockwise from pointing right.
     * @param origin Overrides the wedge's own center, for drawing several wedges about one point.
     * @returns A closed path. A wedge with no inner radius is drawn as a pie slice from the center; one
     * with an inner radius is drawn as a ring segment, out along one edge and back along the other.
     */
    export const getSectorPath = (sector: PlacementSector, origin?: Point2d) => {
        const center = origin ?? sector.origin ?? { x: FULL_WIDTH * HALF, y: FULL_WIDTH * HALF };
        const { innerRadius, outerRadius, fromAngle, toAngle } = sector;
        const sweep = toAngle - fromAngle > HALF_TURN_DEGREES ? LARGE_ARC : SMALL_ARC;
        const at = (radius: number, angle: number) => {
            const radians = angle * AngleUtils.RADIANS_PER_DEGREE;

            return `${center.x + Math.cos(radians) * radius} ${center.y + Math.sin(radians) * radius}`;
        };

        if (innerRadius <= NOTHING) {
            return [
                `M ${center.x} ${center.y}`,
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
        const start = getCenter(from);
        const end = getCenter(to);
        const move = `M ${start.x} ${start.y}`;

        if (origin === undefined) return `${move} L ${end.x} ${end.y}`;

        const radiusX = radii?.x ?? getDistance(origin, start);
        const radiusY = radii?.y ?? radiusX;
        const turned = AngleUtils.getTurn(getAngle(origin, start), getAngle(origin, end));
        const wrapped = turned < NOTHING ? turned + FULL_TURN_DEGREES : turned;
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

    /** The straight-line distance between two points. */
    export const getDistance = toDistance;

    /**
     * The space between two neighboring placements, as a placement of its own.
     *
     * This is what a drop indicator is drawn in. The gap is measured from border to border rather than
     * center to center, so it lands in the space actually between the two items whatever their sizes,
     * and it is rotated to lie along the run — which for a ring means each gap is tilted like the items
     * around it.
     *
     * The ends are handled by inventing a neighbor just past them, placed by continuing the curve the
     * last three items describe. That gives the gap before the first item and after the last one the
     * same size and tilt as the ones in between, rather than a special case that looks wrong on a ring.
     *
     * @param placements The layout's placements, in order.
     * @param index The gap to measure: `0` is before the first item, `placements.length` is after the
     * last.
     * @returns The gap, or `undefined` when there are fewer than two placements or the two neighbors
     * sit on top of each other.
     */
    export const getGapPlacement = (placements: PlacementRect[], index: number): PlacementRect | undefined => {
        if (placements.length < PAIR) return undefined;

        const last = placements.length - SINGLE_STEP;
        const at = (position: number) => placements[position];
        const phantomOf = (from: number, near: number, beyond: number): PlacementRect => {
            const fromCenter = getCenter(at(from));
            const nearCenter = getCenter(at(near));
            const beyondPlacement = at(beyond);
            const center = beyondPlacement
                ? toContinuedCenter(getCenter(beyondPlacement), nearCenter, fromCenter)
                : toMirroredCenter(nearCenter, fromCenter);

            return { ...at(from), leftShare: center.x, topShare: center.y };
        };

        const isBeforeFirst = index <= FIRST_INDEX;
        const isAfterLast = index > last;
        const anchor = isBeforeFirst
            ? phantomOf(FIRST_INDEX, SINGLE_STEP, PAIR)
            : at(Math.min(index, last + SINGLE_STEP) - SINGLE_STEP);
        const neighbor = isAfterLast
            ? phantomOf(last, last - SINGLE_STEP, last - PAIR)
            : at(isBeforeFirst ? FIRST_INDEX : index);

        const from = getCenter(anchor);
        const to = getCenter(neighbor);
        const span = { x: to.x - from.x, y: to.y - from.y };
        const length = Math.hypot(span.x, span.y);

        if (length < NO_DIRECTION_RADIUS) return undefined;

        const forward = { x: span.x / length, y: span.y / length };
        const backward = { x: -forward.x, y: -forward.y };
        const across = { x: -forward.y, y: forward.x };

        const near = toBorderDistance(anchor, forward);
        const far = length - toBorderDistance(neighbor, backward);
        const center = {
            x: from.x + forward.x * (near + far) * HALF,
            y: from.y + forward.y * (near + far) * HALF,
        };

        return {
            leftShare: center.x,
            topShare: center.y,
            widthShare: Math.max(far - near, NOTHING),
            heightShare: Math.min(toExtentAcross(anchor, across), toExtentAcross(neighbor, across)),
            angle: (Math.atan2(forward.y, forward.x) * HALF_TURN_DEGREES) / Math.PI,
        };
    };

    /**
     * Which item a point is aimed at.
     *
     * Two rules, because two shapes need different answers. `"nearest"` takes the closest center, which
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

            const center = getCenter(placements[index]);

            if (rule === "angle" && getDistance(center, origin) < NO_DIRECTION_RADIUS) continue;

            const score =
                rule === "angle"
                    ? AngleUtils.getSeparation(getAngle(origin, defs.point), getAngle(origin, center))
                    : getDistance(defs.point, center);

            if (score >= bestScore) continue;

            bestScore = score;
            bestIndex = index;
        }

        return bestIndex;
    };
}
