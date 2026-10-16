import { MathUtils } from "@thewaver/ss-utils";

import type { InfiniteCorridorLayoutRule } from "../../Exotics/Perspective/InfiniteCorridor/InfiniteCorridor.types";
import { CorridorLayoutDefaults } from "./CorridorLayouts.const";
import type { CorridorLayoutEntry, TubeLayoutDefs, WallsLayoutDefs } from "./CorridorLayouts.types";

const WHOLE = 1;
const HALF = 0.5;
const HALF_TURN_DEGREES = 180;
const FULL_TURN_DEGREES = 360;
const QUARTER_TURN_DEGREES = 90;
const SMALLEST_TUBE = 3;
const HASH_RANGE = 4294967296;
const SEED_STRIDE = 977;
const DRAW_STRIDE = 7;
const SKIP_DRAW = 1;
const SLOTS_PER_CARD_LENGTH = 2;

const toRadians = (degrees: number) => (degrees * Math.PI) / HALF_TURN_DEGREES;

const greatestCommonDivisor = (a: number, b: number): number => (b === 0 ? a : greatestCommonDivisor(b, a % b));

/** Which wall a slot is on: even slots on the left, odd ones on the right, so the walls take turns. */
const toSide = (slot: number) => (slot % 2 === 0 ? -WHOLE : WHOLE);

/** Fades an item in as it comes into reach at the far end, and out as it passes the viewer. */
const toOpacity = (distance: number, visibleDistance: number) =>
    Math.min(MathUtils.clamp01(WHOLE + distance), MathUtils.clamp01(visibleDistance + WHOLE - distance));

/** A number from `0` up to `1` that is always the same for the same item, draw and seed. */
const draw = (index: number, which: number, seed: number) => {
    let value = Math.imul((index * DRAW_STRIDE + which + seed * SEED_STRIDE) ^ 0x9e3779b9, 0x85ebca6b);

    value ^= value >>> 13;
    value = Math.imul(value, 0xc2b2ae35);
    value ^= value >>> 16;

    return (value >>> 0) / HASH_RANGE;
};

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
        WHOLE + fewest + Math.floor(draw(index, SKIP_DRAW, seed) * (most - fewest + 1));

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
 * How far the wall stands from the corridor's middle at a distance, in the space the item is moved in.
 *
 * The width is set as it looks on screen: at the box's own edge level with the viewer, closing evenly to the far width
 * at the end of what is drawn. The perspective shrinks everything by `perspectivePx / (perspectivePx - z)` at depth
 * `z`, so the on-screen width is grown by the reverse of that to find where the wall has to stand to look that wide.
 */
const toHalfWidth = (
    boxWidth: number,
    farWidthRatio: number,
    distance: number,
    visibleDistance: number,
    depth: number,
    perspectivePx: number,
) =>
    boxWidth *
    HALF *
    MathUtils.lerp(WHOLE, farWidthRatio, MathUtils.clamp01(distance / visibleDistance)) *
    ((perspectivePx - depth) / perspectivePx);

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
 * Where an item stands against its wall: its middle pulled in from the wall by half the width it takes up across the
 * corridor, so its outer edge touches the wall whatever its turn.
 */
const toWallX = (side: number, halfWidth: number, itemWidth: number, radians: number) =>
    side * (halfWidth - itemWidth * HALF * Math.cos(radians));

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
     * width over its height; `farWidthRatio`, how wide the corridor looks at the far end as a share of the box, its near
     * end always standing at the box's edges, so `1` keeps the walls there all the way and `0` brings them together;
     * `nearAngleDegrees` and `farAngleDegrees`, how far each item turns from facing the viewer level with the viewer
     * and at the end of what is drawn, turning evenly between; `perspectivePx`, how far away the viewer sits;
     * `visibleCards`, how many card lengths each wall runs from the nearest to the farthest before items fade, empty
     * slots included; `viewDistance`, how many slots down a focused item is brought.
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
        const perspectivePx = defs?.perspectivePx ?? base.perspectivePx;
        const visibleDistance = (defs?.visibleCards ?? base.visibleCards) * SLOTS_PER_CARD_LENGTH;
        const nearRadians = toRadians(nearAngleDegrees);
        const farRadians = toRadians(farAngleDegrees);

        return {
            reach: Math.ceil((Math.ceil(visibleDistance) + WHOLE) / slots.fewestStride) + WHOLE,
            viewDistance: (defs?.viewDistance ?? base.viewDistance) / slots.meanStride,
            place: ({ distance, place, placeCount, count, size }) => {
                const slot = slots.getSlot(place, count, placeCount);
                const slotDistance = slot - slots.getSlot(place - distance, count, placeCount);
                const height = size.height * heightRatio;
                const width = height * aspectRatio;
                const side = toSide(Math.round(slot));
                const angleDegrees = MathUtils.lerp(
                    nearAngleDegrees,
                    farAngleDegrees,
                    MathUtils.clamp01(slotDistance / visibleDistance),
                );
                const radians = toRadians(angleDegrees);
                const depth = -toPackedLength(slotDistance, nearRadians, farRadians, visibleDistance) * HALF * width;
                const halfWidth = toHalfWidth(
                    size.width,
                    farWidthRatio,
                    slotDistance,
                    visibleDistance,
                    depth,
                    perspectivePx,
                );

                return {
                    size: { width, height },
                    offset: { x: toWallX(side, halfWidth, width, radians), y: 0, z: depth },
                    turnDegrees: -side * angleDegrees,
                    perspectivePx,
                    opacity: toOpacity(slotDistance, visibleDistance),
                };
            },
        };
    };

    /** {@link createWalls} with its defaults. */
    export const walls = createWalls();

    /**
     * Items lining the inside of a tube, ring after ring, each facing the middle with its top towards the far end, so
     * on screen every item stands upright towards the centre: the one below the middle upright, the one on the right
     * on its side, the one above upside down.
     *
     * The tube is a ring of flat sides rather than a smooth circle, since every item is flat. Each item runs from its
     * own ring's edge to the next ring's, stretched to that length and leaned to follow the taper, so the rings always
     * touch however the tube narrows or widens. Items fill a ring in order, one per side, each followed by a gap of
     * empty sides drawn between `minSkipCount` and `maxSkipCount`, the gaps carrying on into the next ring; the drawn
     * items are repeated until items and gaps together fill whole rings, and a ring passes the viewer whole before it
     * comes round to the far end. A twist turns each ring further round as it comes towards the viewer, which bends the
     * rings into a corkscrew that turns as the corridor moves.
     *
     * @param defs `sides`, how many sides one ring has, at least `3`; `minSkipCount` and `maxSkipCount`, the fewest and
     * most empty sides after an item; `seed`, which of the many drawings of the gaps this is; `radiusRatio`, how far the
     * tube's sides stand from its axis level with the viewer, as a share of half the box's longer side; `farWidthRatio`,
     * how wide the tube looks at the far end as a share of its near width, so `1` keeps it the same width all the way
     * down and `0` closes it to a point; `depthRatio`, how long each item runs down the tube as a share of its width
     * level with the viewer; `tiltDegrees`, how far each item leans back from facing the viewer, `90` lying along the
     * tube's side; `twistDegrees`, how far each ring turns round from the one behind it; `spinDegrees`, how far the whole
     * tube is turned round its axis, which a consumer turns on a clock to spin it steadily whatever the corridor's
     * position; `perspectivePx`, how far away the viewer sits; `visibleRings`, how many rings stay drawn before they
     * fade; `viewRings`, how many rings down the tube a focused item is brought.
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
        const radiusRatio = defs?.radiusRatio ?? base.radiusRatio;
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
            viewDistance: ((defs?.viewRings ?? base.viewRings) * sides) / slots.meanStride,
            behindDistance: Math.ceil(sides / slots.fewestStride),
            placeMultiple: (count) => (count * sides) / greatestCommonDivisor(slots.getLapSlots(count), sides),
            place: ({ distance, place, placeCount, count, size }) => {
                const slot = Math.round(slots.getSlot(place, count, placeCount));
                const slotDistance = slot - slots.getSlot(place - distance, count, placeCount);
                const around = slot % sides;
                const ring = (slotDistance - around) / sides;
                const nearRadius = Math.max(size.width, size.height) * HALF * radiusRatio;
                const step = 2 * nearRadius * Math.sin(sideRadians) * depthRatio;
                const toRadius = (edge: number) =>
                    nearRadius *
                    MathUtils.lerp(WHOLE, farWidthRatio, MathUtils.clamp01(edge / visibleRings)) *
                    ((perspectivePx + edge * step) / perspectivePx);
                const nearEdge = toRadius(ring);
                const farEdge = toRadius(ring + WHOLE);
                const inward = (nearEdge - farEdge) * Math.cos(sideRadians);
                const apothem = ((nearEdge + farEdge) / 2) * Math.cos(sideRadians);
                const width = (nearEdge + farEdge) * Math.sin(sideRadians);
                const rollDegrees = (around * FULL_TURN_DEGREES) / sides + ring * twistDegrees + spinDegrees;
                const roll = toRadians(rollDegrees);
                const slantDegrees = (Math.atan2(step, inward) * HALF_TURN_DEGREES) / Math.PI;

                return {
                    size: { width, height: Math.hypot(step, inward) },
                    offset: {
                        x: -apothem * Math.sin(roll),
                        y: apothem * Math.cos(roll),
                        z: -(ring + HALF) * step,
                    },
                    turnDegrees: 0,
                    rollDegrees,
                    tiltDegrees: slantDegrees + tiltDegrees - QUARTER_TURN_DEGREES,
                    perspectivePx,
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
