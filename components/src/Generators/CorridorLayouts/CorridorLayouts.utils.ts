import { AngleUtils, MathUtils, Point3d, Point3dUtils, type Quad, RandomUtils } from "@thewaver/ss-utils";

import type { InfiniteCorridorLayoutRule } from "../../Exotics/Perspective/InfiniteCorridor/InfiniteCorridor.types";
import { CorridorLayoutDefaults } from "./CorridorLayouts.const";
import type { CorridorLayoutEntry, TubeCornerDefs, TubeLayoutDefs, WallsLayoutDefs } from "./CorridorLayouts.types";

const WHOLE = 1;
const HALF = 0.5;
const HALF_TURN_DEGREES = 180;
const FULL_TURN_DEGREES = 360;
const QUARTER_TURN_DEGREES = 90;
const SMALLEST_TUBE = 3;
const SKIP_DRAW = 1;
const SLOTS_PER_CARD_LENGTH = 2;
const HALF_CARD_SLOTS = SLOTS_PER_CARD_LENGTH * HALF;
const LEFT_WALL = -1;
const LEFT_SIDE = 1;
const RIGHT_SIDE = -1;

/** Where a ring's vertex stands, `side` half a side's turn either way of the side's middle, round the tube's axis. */
const toTubeVertex = (radius: number, depth: number, rollDegrees: number, side: number, sideDegrees: number) =>
    Point3dUtils.fromCylindrical(radius, QUARTER_TURN_DEGREES + rollDegrees + side * sideDegrees, depth);

/** Which wall a slot is on: even slots on the left, odd ones on the right, so the walls take turns. */
const toSide = (slot: number) => (slot % 2 === 0 ? LEFT_WALL : WHOLE);

/** Fades an item in as it comes into reach at the far end, and out as it passes the viewer. */
const toOpacity = (distance: number, visibleDistance: number) =>
    Math.min(MathUtils.clamp01(WHOLE + distance), MathUtils.clamp01(visibleDistance + WHOLE - distance));

/**
 * Lays the drawn items out along a run of slots, each item followed by an empty gap of its own.
 *
 * Every item's gap is drawn from its index and the seed, from `minSkipCount` up to `maxSkipCount` empty slots, so a
 * copy has its original's gap. An item's slot is the sum of the slots taken by every item before it round the ring of
 * drawn items, which is worked out once for a given item count and ring length and kept. Between two items the slot
 * runs on evenly across the first one's gap, so a position partway from one item to the next is partway across it.
 */
const createSlots = (minSkipCount: number, maxSkipCount: number, seed: number) => {
    const fewest = Math.max(Math.round(minSkipCount), 0);
    const most = Math.max(Math.round(maxSkipCount), fewest);

    const getStride = (index: number) =>
        WHOLE + fewest + Math.floor(RandomUtils.hash(index, SKIP_DRAW, seed) * (most - fewest + 1));

    let measured: { count: number; placeCount: number; starts: number[]; total: number } | undefined;

    const measure = (count: number, placeCount: number) => {
        if (measured?.count === count && measured.placeCount === placeCount) return measured;

        const starts: number[] = [];
        let total = 0;

        for (let place = 0; place < placeCount; place++) {
            starts.push(total);
            total += getStride(place % Math.max(count, 1));
        }

        measured = { count, placeCount, starts, total };

        return measured;
    };

    return {
        fewestStride: WHOLE + fewest,
        meanStride: WHOLE + (fewest + most) * HALF,
        getLapSlots: (count: number) => {
            let total = 0;

            for (let index = 0; index < count; index++) total += getStride(index);

            return total;
        },
        getSlot: (position: number, count: number, placeCount: number) => {
            if (placeCount <= 0) return position;

            const { starts, total } = measure(count, placeCount);
            const lap = Math.floor(position / placeCount);
            const within = position - lap * placeCount;
            const place = Math.min(Math.floor(within), placeCount - 1);

            return lap * total + starts[place] + (within - place) * getStride(place % Math.max(count, 1));
        },
    };
};

/**
 * How far a wall leans in towards the corridor's middle as it runs away from the viewer.
 *
 * The wall is flat, so its edges are straight lines on screen. It stands at the box's own edge level with the viewer
 * and leans so that the innermost point drawn at the far end, `farAlong` down the wall and `farInset` in from it, looks
 * `farWidthRatio` of the box from the same point on the other wall. The perspective shrinks everything by
 * `perspectivePx / (perspectivePx - z)` at depth `z`; with the wall leaning by `lean`, that point stands
 * `nearHalfWidth - farAlong * sin(lean) - farInset * cos(lean)` from the middle at depth
 * `-farAlong * cos(lean) + farInset * sin(lean)`, and setting it on screen to the far width leaves one sum of `sin(lean)`
 * and `cos(lean)` equal to a fixed number, solved here. A far width too narrow to reach turns the wall as far across as
 * it can go.
 *
 * @returns The lean in radians, below `0` leaning outwards.
 */
const toWallLean = (
    boxWidth: number,
    farWidthRatio: number,
    farAlong: number,
    farInset: number,
    perspectivePx: number,
) => {
    const nearHalfWidth = boxWidth * HALF;
    const farHalfWidth = nearHalfWidth * farWidthRatio;
    const alongShare = farAlong * perspectivePx - farInset * farHalfWidth;
    const insetShare = farInset * perspectivePx + farAlong * farHalfWidth;
    const reach = Math.hypot(alongShare, insetShare);

    if (reach <= 0) return 0;

    const share = (nearHalfWidth * perspectivePx * (WHOLE - farWidthRatio)) / reach;

    return Math.asin(MathUtils.clamp(share, -WHOLE, WHOLE)) - Math.atan2(insetShare, alongShare);
};

/**
 * How far down a wall an item stands when the items' angle changes along it.
 *
 * Items are packed so their edges just meet, so each one takes up `sin(angle)` of its width down the wall, and with the
 * angle turning evenly from `nearRadians` level with the viewer to `farRadians` at `visibleDistance` the depth is the
 * running total of that: `(cos(near) - cos(angle)) / rate` while the angle is turning, and a straight run at the far
 * angle beyond it. Behind the viewer the near angle holds.
 *
 * @returns The depth in item widths, before it is halved for the two walls taking turns.
 */
const toPackedLength = (distance: number, nearRadians: number, farRadians: number, visibleDistance: number) => {
    if (distance <= 0) return distance * Math.sin(nearRadians);

    const rate = (farRadians - nearRadians) / visibleDistance;
    const turning = Math.min(distance, visibleDistance);
    const turned =
        Math.abs(rate) < Number.EPSILON
            ? turning * Math.sin(nearRadians)
            : (Math.cos(nearRadians) - Math.cos(nearRadians + rate * turning)) / rate;

    return turned + Math.max(distance - visibleDistance, 0) * Math.sin(farRadians);
};

/**
 * Where an item stands against its wall: `along` down the wall, its middle pulled in from the wall by half the width it
 * takes up across it, so its outer edge touches the wall whatever its turn.
 */
const toWallOffset = (
    side: number,
    nearHalfWidth: number,
    along: number,
    lean: number,
    itemWidth: number,
    radians: number,
) => {
    const inset = itemWidth * HALF * Math.cos(radians);

    return {
        x: side * (nearHalfWidth - along * Math.sin(lean) - inset * Math.cos(lean)),
        y: 0,
        z: -along * Math.cos(lean) + inset * Math.sin(lean),
    };
};

/**
 * The layouts this library ships for `InfiniteCorridor`, as factories a consumer can tune or take as they are.
 *
 * A layout places one item from how far down the corridor it is, says how far it reaches and where a focused item is
 * brought — see `InfiniteCorridorLayoutRule`. In `walls` items take turns between the left and the right wall, each
 * turned to face across the corridor; `tube` lines a ring of sides round the axis instead. Every layout reads
 * the corridor's box for its lengths, so it fits a corridor of any size, and distances arrive fractional as the
 * corridor moves, so every layout is continuous in them.
 */
export namespace CorridorLayoutUtils {
    /**
     * One tidy row on each wall at eye level, the items packed so close that each wall reads as one strip running to
     * the vanishing point.
     *
     * The walls are a run of slots taking turns left and right, and each item is followed by a gap of empty slots, each
     * as long as an item, drawn between `minSkipCount` and `maxSkipCount`: a gap of `1` after every item puts them all
     * on the left wall, a gap of `2` alternates walls with two empty slots between.
     *
     * @param defs `minSkipCount` and `maxSkipCount`, the fewest and most empty slots after an item; `seed`, which of the
     * many drawings of the gaps this is; `heightRatio`, how tall an item is as a share of the box; `aspectRatio`, its
     * width over its height; `farWidthRatio`, how far apart the innermost edges of the last items drawn look as a share
     * of the box, measured where the last fading item ends, so nothing drawn at the far end comes closer to the middle,
     * the near end always standing at the box's edges, so `1` keeps the walls there all the way and `0` brings them
     * together; `nearAngleDegrees` and `farAngleDegrees`, how far each item turns from standing square across its wall,
     * level with the viewer and at the end of what is drawn, turning evenly between, so `90` lays it flat along the
     * wall; `staggerRatio`, how far each item on the right wall stands down from the slot before it, `1` half an item
     * further so the walls take turns and `0` level with it so items on both walls stand side by side; `perspectivePx`,
     * how far away the viewer sits;
     * `visibleCards`, how many card lengths each wall runs from the nearest to the farthest before items fade, empty
     * slots included; `focusDistance`, how many slots down a focused item is brought.
     * @returns The layout, ready to hand to `layout`.
     */
    export const createWalls = (defs?: WallsLayoutDefs): InfiniteCorridorLayoutRule => {
        const base = CorridorLayoutDefaults.WALLS_DEFAULTS;
        const slots = createSlots(
            defs?.minSkipCount ?? base.minSkipCount,
            defs?.maxSkipCount ?? base.maxSkipCount,
            defs?.seed ?? base.seed,
        );
        const heightRatio = defs?.heightRatio ?? base.heightRatio;
        const aspectRatio = defs?.aspectRatio ?? base.aspectRatio;
        const farWidthRatio = defs?.farWidthRatio ?? base.farWidthRatio;
        const nearAngleDegrees = defs?.nearAngleDegrees ?? base.nearAngleDegrees;
        const farAngleDegrees = defs?.farAngleDegrees ?? base.farAngleDegrees;
        const staggerRatio = defs?.staggerRatio ?? base.staggerRatio;
        const perspectivePx = defs?.perspectivePx ?? base.perspectivePx;
        const visibleDistance = (defs?.visibleCards ?? base.visibleCards) * SLOTS_PER_CARD_LENGTH;
        const nearRadians = AngleUtils.toRadians(nearAngleDegrees);
        const farRadians = AngleUtils.toRadians(farAngleDegrees);

        return {
            reach: Math.ceil((Math.ceil(visibleDistance) + WHOLE) / slots.fewestStride) + WHOLE,
            focusDistance: (defs?.focusDistance ?? base.focusDistance) / slots.meanStride,
            place: ({ distance, place, placeCount, count, size }) => {
                const slot = slots.getSlot(place, count, placeCount);
                const side = toSide(Math.round(slot));
                const slotDistance =
                    slot -
                    slots.getSlot(place - distance, count, placeCount) -
                    (side === LEFT_WALL ? 0 : (WHOLE - staggerRatio) * HALF_CARD_SLOTS);
                const height = size.height * heightRatio;
                const width = height * aspectRatio;
                const angleDegrees = MathUtils.lerp(
                    nearAngleDegrees,
                    farAngleDegrees,
                    MathUtils.clamp01(slotDistance / visibleDistance),
                );
                const radians = AngleUtils.toRadians(angleDegrees);
                const along = toPackedLength(slotDistance, nearRadians, farRadians, visibleDistance) * HALF * width;
                const farAlong =
                    toPackedLength(visibleDistance + SLOTS_PER_CARD_LENGTH, nearRadians, farRadians, visibleDistance) *
                    HALF *
                    width;
                const lean = toWallLean(
                    size.width,
                    farWidthRatio,
                    farAlong,
                    width * Math.cos(farRadians),
                    perspectivePx,
                );

                return {
                    size: { width, height },
                    offset: toWallOffset(side, size.width * HALF, along, lean, width, radians),
                    turnDegrees: -side * (angleDegrees - AngleUtils.fromRadians(lean)),
                    perspectivePx,
                    opacity: toOpacity(slotDistance, visibleDistance),
                };
            },
        };
    };

    /** {@link createWalls} with its defaults. */
    export const walls = createWalls();

    /**
     * Where one item lining a tube has its four corners on screen, so it can be pinned there and meet its neighbors
     * edge to edge.
     *
     * The tube is a ring of flat sides, and the item covers one side from where it crosses one ring, its near edge, to
     * where it crosses the next, its far edge, with its top towards the far end. Each edge is turned round the axis by
     * its own roll, so a twist that turns each ring further than the one behind it carries on smoothly from one item
     * to the next. The item is then leaned about its own level middle line, `0` lying along the side and a quarter turn
     * back standing upright facing the viewer, and seen in perspective.
     *
     * @param defs `sides`, how many sides a ring has; `nearRadius` and `farRadius`, how far each edge's ring stands
     * from the axis, in pixels; `nearDepth` and `farDepth`, how far each edge is towards the viewer, in pixels, below
     * `0` going away; `nearRollDegrees` and `farRollDegrees`, how far each edge is turned round the axis, clockwise as
     * seen by the viewer, `0` putting the side's middle straight below the axis; `leanDegrees`, how far the item leans
     * back off the side towards the viewer; `perspectivePx`, how far away the viewer sits.
     * @returns The corners in pixels on screen from the middle of the box, or `undefined` when any of them is level
     * with the viewer or behind them.
     */
    export const computeTubeCorners = (defs: TubeCornerDefs): Quad | undefined => {
        const sideDegrees = HALF_TURN_DEGREES / defs.sides;
        const near = (side: number) =>
            toTubeVertex(defs.nearRadius, defs.nearDepth, defs.nearRollDegrees, side, sideDegrees);
        const far = (side: number) =>
            toTubeVertex(defs.farRadius, defs.farDepth, defs.farRollDegrees, side, sideDegrees);
        const lying = {
            top_left: far(LEFT_SIDE),
            top_right: far(RIGHT_SIDE),
            bottom_right: near(RIGHT_SIDE),
            bottom_left: near(LEFT_SIDE),
        };
        const center = Point3dUtils.getCentroid([
            lying.top_left,
            lying.top_right,
            lying.bottom_right,
            lying.bottom_left,
        ]);
        const rightward = Point3d.sub(
            Point3d.add(lying.top_right, lying.bottom_right),
            Point3d.add(lying.top_left, lying.bottom_left),
        );
        const axis = Point3dUtils.getLength(rightward) > 0 ? rightward : { x: WHOLE, y: 0, z: 0 };
        const toScreen = (point: Point3d) =>
            Point3dUtils.project(Point3dUtils.rotateAbout(point, center, axis, defs.leanDegrees), defs.perspectivePx);
        const corners = {
            top_left: toScreen(lying.top_left),
            top_right: toScreen(lying.top_right),
            bottom_right: toScreen(lying.bottom_right),
            bottom_left: toScreen(lying.bottom_left),
        };

        if (!corners.top_left || !corners.top_right || !corners.bottom_right || !corners.bottom_left) return undefined;

        return corners as Quad;
    };

    /**
     * Items lining the inside of a tube, ring after ring, each facing the middle with its top towards the far end, so
     * on screen every item stands upright towards the center: the one below the middle upright, the one on the right
     * on its side, the one above upside down.
     *
     * The tube is a ring of flat sides rather than a smooth circle, since every item is flat. Each item's four corners
     * are pinned where its side crosses its own ring and the next — see {@link computeTubeCorners} — so it meets its
     * neighbors edge to edge round the ring and on to the next ring, however the tube narrows, widens or twists.
     * Items fill a ring in order, one per side, each followed by a gap of
     * empty sides drawn between `minSkipCount` and `maxSkipCount`, the gaps carrying on into the next ring; the drawn
     * items are repeated until items and gaps together fill whole rings, and a ring passes the viewer whole before it
     * comes round to the far end. A twist turns each ring further round as it comes towards the viewer, which bends the
     * rings into a corkscrew that turns as the corridor moves.
     *
     * @param defs `sides`, how many sides one ring has, at least `3`; `minSkipCount` and `maxSkipCount`, the fewest and
     * most empty sides after an item; `seed`, which of the many drawings of the gaps this is; `nearWidthRatio`, how wide
     * the tube is level with the viewer, as a share of the box's longer side; `farWidthRatio`,
     * how wide the tube looks at the far end as a share of its near width, so `1` keeps it the same width all the way
     * down and `0` closes it to a point; `depthRatio`, how long each item runs down the tube as a share of its width
     * level with the viewer; `tiltDegrees`, how far each item leans back from facing the viewer, `90` lying along the
     * tube's side; `twistDegrees`, how far each ring turns round from the one behind it; `spinDegrees`, how far the whole
     * tube is turned round its axis, which a consumer turns on a clock to spin it steadily whatever the corridor's
     * position; `perspectivePx`, how far away the viewer sits; `visibleRings`, how many rings stay drawn before they
     * fade; `focusRings`, how many rings down the tube a focused item is brought.
     * @returns The layout, ready to hand to `layout`.
     */
    export const createTube = (defs?: TubeLayoutDefs): InfiniteCorridorLayoutRule => {
        const base = CorridorLayoutDefaults.TUBE_DEFAULTS;
        const sides = Math.max(Math.round(defs?.sides ?? base.sides), SMALLEST_TUBE);
        const slots = createSlots(
            defs?.minSkipCount ?? base.minSkipCount,
            defs?.maxSkipCount ?? base.maxSkipCount,
            defs?.seed ?? base.seed,
        );
        const nearWidthRatio = defs?.nearWidthRatio ?? base.nearWidthRatio;
        const farWidthRatio = defs?.farWidthRatio ?? base.farWidthRatio;
        const depthRatio = defs?.depthRatio ?? base.depthRatio;
        const tiltDegrees = defs?.tiltDegrees ?? base.tiltDegrees;
        const twistDegrees = defs?.twistDegrees ?? base.twistDegrees;
        const spinDegrees = defs?.spinDegrees ?? base.spinDegrees;
        const perspectivePx = defs?.perspectivePx ?? base.perspectivePx;
        const visibleRings = defs?.visibleRings ?? base.visibleRings;
        const sideRadians = Math.PI / sides;

        return {
            reach: Math.ceil(((Math.ceil(visibleRings) + WHOLE) * sides + sides) / slots.fewestStride),
            focusDistance: ((defs?.focusRings ?? base.focusRings) * sides) / slots.meanStride,
            behindDistance: Math.ceil(sides / slots.fewestStride),
            placeMultiple: (count) =>
                (count * sides) / MathUtils.getGreatestCommonDivisor(slots.getLapSlots(count), sides),
            place: ({ distance, place, placeCount, count, size }) => {
                const slot = Math.round(slots.getSlot(place, count, placeCount));
                const slotDistance = slot - slots.getSlot(place - distance, count, placeCount);
                const around = slot % sides;
                const ring = (slotDistance - around) / sides;
                const nearRadius = Math.max(size.width, size.height) * HALF * nearWidthRatio;
                const step = 2 * nearRadius * Math.sin(sideRadians) * depthRatio;
                const toRadius = (edge: number) =>
                    nearRadius *
                    MathUtils.lerp(WHOLE, farWidthRatio, MathUtils.clamp01(edge / visibleRings)) *
                    ((perspectivePx + MathUtils.clamp(edge, 0, visibleRings) * step) / perspectivePx);
                const nearEdge = toRadius(ring);
                const farEdge = toRadius(ring + WHOLE);
                const nearestEdge = toRadius(0);
                const nextEdge = toRadius(WHOLE);
                const inward = (nearestEdge - nextEdge) * Math.cos(sideRadians);
                const sideRollDegrees = (around * FULL_TURN_DEGREES) / sides + spinDegrees;

                return {
                    size: { width: (nearestEdge + nextEdge) * Math.sin(sideRadians), height: Math.hypot(step, inward) },
                    corners: computeTubeCorners({
                        sides,
                        nearRadius: nearEdge,
                        farRadius: farEdge,
                        nearDepth: -ring * step,
                        farDepth: -(ring + WHOLE) * step,
                        nearRollDegrees: sideRollDegrees + ring * twistDegrees,
                        farRollDegrees: sideRollDegrees + (ring + WHOLE) * twistDegrees,
                        leanDegrees: tiltDegrees - QUARTER_TURN_DEGREES,
                        perspectivePx,
                    }),
                    opacity: Math.min(MathUtils.clamp01(WHOLE + ring), MathUtils.clamp01(visibleRings + WHOLE - ring)),
                };
            },
        };
    };

    /** {@link createTube} with its defaults. */
    export const tube = createTube();

    /**
     * The layout a sample entry names, built with the entry's own tuning.
     *
     * @param entry One of the samples, or any entry of the same shape.
     * @returns The layout, ready to hand to `layout`.
     */
    export const toLayoutRule = (entry: CorridorLayoutEntry): InfiniteCorridorLayoutRule => {
        switch (entry.family) {
            case "walls":
                return createWalls(entry.defs);
            case "tube":
                return createTube(entry.defs);
        }
    };
}
