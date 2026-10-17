import { describe, expect, it } from "vitest";

import type {
    InfiniteCorridorLayoutDefs,
    InfiniteCorridorLayoutRule,
} from "../../Exotics/Perspective/InfiniteCorridor/InfiniteCorridor.types";
import { CorridorLayouts } from "../../Samples/InfiniteCorridor/Layouts/CorridorLayouts.const";
import { CorridorLayoutUtils } from "./CorridorLayouts.utils";

const BASE: InfiniteCorridorLayoutDefs = {
    distance: 0,
    place: 0,
    placeCount: 48,
    index: 0,
    count: 16,
    size: { width: 600, height: 400 },
};

const at = (distance: number, place: number) => ({ ...BASE, distance, place, index: place % BASE.count });

const LAYOUTS = CorridorLayouts.SAMPLE_KEYS.map(
    (key) => [key, CorridorLayoutUtils.toLayoutRule(CorridorLayouts.SAMPLE_LAYOUTS[key])] as const,
);

const numbersOf = (placement: ReturnType<(typeof LAYOUTS)[number][1]["place"]>) =>
    "corners" in placement
        ? [
              placement.size.width,
              placement.size.height,
              ...Object.values(placement.corners ?? {}).flatMap((point) => [point.x, point.y]),
              placement.opacity,
          ]
        : [
              placement.size.width,
              placement.size.height,
              placement.offset.x,
              placement.offset.y,
              placement.offset.z,
              placement.turnDegrees,
              placement.rollDegrees ?? 0,
              placement.tiltDegrees ?? 0,
              placement.opacity,
          ];

const turnedAt = (layout: InfiniteCorridorLayoutRule, distance: number, place: number) => {
    const placement = layout.place(at(distance, place));

    if ("corners" in placement) throw new Error("expected a turned placement");

    return placement;
};

const cornersAt = (layout: InfiniteCorridorLayoutRule, distance: number, place: number) => {
    const placement = layout.place(at(distance, place));

    if (!("corners" in placement) || !placement.corners) throw new Error("expected corners that can be drawn");

    return placement.corners;
};

const angleOf = (point: { x: number; y: number }) => (Math.atan2(point.y, point.x) * 180) / Math.PI;

describe("every sample layout", () => {
    it.each(LAYOUTS)("%s answers finite numbers at every distance", (_key, layout) => {
        for (const distance of [-1.5, -0.5, 0, 0.25, 3, 17.5]) {
            for (const number of numbersOf(layout.place(at(distance, 5)))) expect(Number.isFinite(number)).toBe(true);
        }
    });

    it.each(LAYOUTS)("%s moves smoothly, with no jump between two nearby distances", (_key, layout) => {
        const before = numbersOf(layout.place(at(2.49, 5)));
        const after = numbersOf(layout.place(at(2.51, 5)));

        before.forEach((value, index) => expect(Math.abs(value - after[index])).toBeLessThan(20));
    });

    it.each(LAYOUTS)("%s reaches further than it brings a focused item", (_key, layout) => {
        expect(layout.reach).toBeGreaterThan(layout.focusDistance);
    });
});

describe("walls", () => {
    it("takes turns between the walls, and a gap of one keeps every item on the left", () => {
        const alternating = CorridorLayoutUtils.walls;
        const leftOnly = CorridorLayoutUtils.createWalls({ minSkipCount: 1, maxSkipCount: 1 });

        expect(Math.sign(turnedAt(alternating, 0, 0).offset.x)).toBe(-Math.sign(turnedAt(alternating, 1, 1).offset.x));
        expect(turnedAt(leftOnly, 0, 0).offset.x).toBeLessThan(0);
        expect(turnedAt(leftOnly, 1, 1).offset.x).toBeLessThan(0);
    });

    it("packs two items on one wall a card's length apart down it at whatever angle they stand", () => {
        const walls = CorridorLayoutUtils.createWalls({ nearAngleDegrees: 60, farAngleDegrees: 60 });
        const near = turnedAt(walls, 0, 0);
        const next = turnedAt(walls, 2, 2);

        expect(near.offset.z - next.offset.z).toBeCloseTo(near.size.width * Math.sin(Math.PI / 3), 6);
    });

    it("turns its items from the near angle to the far one, still going deeper all the way", () => {
        const walls = CorridorLayoutUtils.createWalls({ nearAngleDegrees: 90, farAngleDegrees: 30, visibleCards: 4 });
        const depths = [0, 2, 4, 6, 8, 10].map((distance) => turnedAt(walls, distance, distance).offset.z);

        expect(Math.abs(turnedAt(walls, 0, 0).turnDegrees)).toBe(90);
        expect(Math.abs(turnedAt(walls, 8, 8).turnDegrees)).toBe(30);
        depths.slice(1).forEach((depth, index) => expect(depth).toBeLessThan(depths[index]));
    });
});

describe("tube", () => {
    it("puts a ring's items at one depth, the first of them below the middle", () => {
        const tube = CorridorLayoutUtils.tube;
        const reaches = Array.from({ length: 12 }, (_, place) => {
            const corner = cornersAt(tube, place, place).bottom_left;

            return Math.hypot(corner.x, corner.y);
        });
        const first = cornersAt(tube, 0, 0);

        reaches.forEach((reach) => expect(reach).toBeCloseTo(reaches[0], 6));
        expect(first.bottom_left.y).toBeGreaterThan(0);
        expect(first.bottom_left.x).toBeLessThan(0);
        expect(first.bottom_right.x).toBeGreaterThan(0);
    });

    it("meets its neighbors edge to edge, round the ring and on to the next ring, even when twisted", () => {
        const tube = CorridorLayoutUtils.createTube({ twistDegrees: 10 });
        const item = cornersAt(tube, 3, 3);
        const beside = cornersAt(tube, 4, 4);
        const beyond = cornersAt(tube, 15, 15);

        expect(beside.bottom_right.x).toBeCloseTo(item.bottom_left.x, 6);
        expect(beside.bottom_right.y).toBeCloseTo(item.bottom_left.y, 6);
        expect(beside.top_right.x).toBeCloseTo(item.top_left.x, 6);
        expect(beyond.bottom_left.x).toBeCloseTo(item.top_left.x, 6);
        expect(beyond.bottom_left.y).toBeCloseTo(item.top_left.y, 6);
        expect(beyond.bottom_right.x).toBeCloseTo(item.top_right.x, 6);
    });

    it("draws nothing for an item with a corner level with the viewer or behind", () => {
        const tube = CorridorLayoutUtils.createTube({ depthRatio: 20 });
        const placement = tube.place(at(-6, 0));

        expect("corners" in placement && placement.corners).toBeUndefined();
    });

    it("lets a whole ring pass the viewer, and asks for a drawn count that fills whole rings", () => {
        const tube = CorridorLayoutUtils.createTube({ sides: 12 });
        const multiple = tube.placeMultiple!(16);

        expect(tube.behindDistance).toBe(12);
        expect(((multiple / 16) * 16) % 12).toBe(0);
    });

    it("turns every item round its axis by the spin, whatever its distance", () => {
        const still = cornersAt(CorridorLayoutUtils.createTube(), 3, 3).bottom_left;
        const spun = cornersAt(CorridorLayoutUtils.createTube({ spinDegrees: 30 }), 3, 3).bottom_left;

        expect((angleOf(spun) - angleOf(still) + 360) % 360).toBeCloseTo(30, 6);
    });
});
