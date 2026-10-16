import { describe, expect, it } from "vitest";

import type { InfiniteCorridorLayoutDefs } from "../../Exotics/Perspective/InfiniteCorridor/InfiniteCorridor.types";
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

const numbersOf = (placement: ReturnType<(typeof LAYOUTS)[number][1]["place"]>) => [
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
        expect(layout.reach).toBeGreaterThan(layout.viewDistance);
    });
});

describe("walls", () => {
    it("takes turns between the walls, and a gap of one keeps every item on the left", () => {
        const alternating = CorridorLayoutUtils.walls;
        const leftOnly = CorridorLayoutUtils.createWalls({ minSkipCount: 1, maxSkipCount: 1 });

        expect(Math.sign(alternating.place(at(0, 0)).offset.x)).toBe(-Math.sign(alternating.place(at(1, 1)).offset.x));
        expect(leftOnly.place(at(0, 0)).offset.x).toBeLessThan(0);
        expect(leftOnly.place(at(1, 1)).offset.x).toBeLessThan(0);
    });

    it("packs two items on one wall a card's length apart down it at whatever angle they stand", () => {
        const walls = CorridorLayoutUtils.createWalls({ nearAngleDegrees: 60, farAngleDegrees: 60 });
        const near = walls.place(at(0, 0));
        const next = walls.place(at(2, 2));

        expect(near.offset.z - next.offset.z).toBeCloseTo(near.size.width * Math.sin(Math.PI / 3), 6);
    });

    it("turns its items from the near angle to the far one, still going deeper all the way", () => {
        const walls = CorridorLayoutUtils.createWalls({ nearAngleDegrees: 90, farAngleDegrees: 30, visibleCards: 4 });
        const depths = [0, 2, 4, 6, 8, 10].map((distance) => walls.place(at(distance, distance)).offset.z);

        expect(Math.abs(walls.place(at(0, 0)).turnDegrees)).toBe(90);
        expect(Math.abs(walls.place(at(8, 8)).turnDegrees)).toBe(30);
        depths.slice(1).forEach((depth, index) => expect(depth).toBeLessThan(depths[index]));
    });
});

describe("tube", () => {
    it("puts a ring's items at one depth, the first of them below the middle", () => {
        const tube = CorridorLayoutUtils.tube;
        const depths = Array.from({ length: 12 }, (_, place) => tube.place(at(place, place)).offset.z);
        const first = tube.place(at(0, 0));

        depths.forEach((depth) => expect(depth).toBeCloseTo(depths[0], 6));
        expect(first.offset.y).toBeGreaterThan(0);
        expect(Math.abs(first.offset.x)).toBeLessThan(1e-6);
    });

    it("lets a whole ring pass the viewer, and asks for a drawn count that fills whole rings", () => {
        const tube = CorridorLayoutUtils.createTube({ sides: 12 });
        const multiple = tube.placeMultiple!(16);

        expect(tube.behindDistance).toBe(12);
        expect(((multiple / 16) * 16) % 12).toBe(0);
    });

    it("turns every item round its axis by the spin, whatever its distance", () => {
        const still = CorridorLayoutUtils.createTube().place(at(3, 3));
        const spun = CorridorLayoutUtils.createTube({ spinDegrees: 30 }).place(at(3, 3));

        expect(spun.rollDegrees! - still.rollDegrees!).toBeCloseTo(30, 6);
    });
});
