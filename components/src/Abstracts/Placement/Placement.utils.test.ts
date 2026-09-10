import { describe, expect, it } from "vitest";

import type { PlacementLayout, PlacementRect } from "./Placement.types";
import { PlacementUtils } from "./Placement.utils";

const RING: PlacementLayout = {
    heightRatio: 1,
    pickRule: "angle",
    placements: [
        { left: 0.5, top: 0.1, width: 0.2, height: 0.2 },
        { left: 0.9, top: 0.5, width: 0.2, height: 0.2 },
        { left: 0.5, top: 0.9, width: 0.2, height: 0.2 },
        { left: 0.1, top: 0.5, width: 0.2, height: 0.2 },
    ],
};

const SCATTER: PlacementLayout = {
    heightRatio: 0.5,
    placements: [
        { left: 0.1, top: 0.1, width: 0.1, height: 0.1 },
        { left: 0.9, top: 0.4, width: 0.1, height: 0.1 },
        { left: 0.5, top: 0.25, width: 0.1, height: 0.1 },
    ],
};

describe("toLayoutPoint", () => {
    it("keeps the horizontal share as it is and scales the vertical one by the layout's own height", () => {
        expect(PlacementUtils.toLayoutPoint({ x: 0.25, y: 0.5 }, 0.5)).toEqual({ x: 0.25, y: 0.25 });
    });

    it("leaves a square layout's point untouched, since its height is already one width", () => {
        expect(PlacementUtils.toLayoutPoint({ x: 0.25, y: 0.75 }, 1)).toEqual({ x: 0.25, y: 0.75 });
    });
});

describe("getOrigin", () => {
    it("is the middle of the box when the layout names none", () => {
        expect(PlacementUtils.getOrigin(RING)).toEqual({ x: 0.5, y: 0.5 });
        expect(PlacementUtils.getOrigin(SCATTER), "half a width across, half the height down").toEqual({
            x: 0.5,
            y: 0.25,
        });
    });

    it("is whatever the layout named when it named one, which is what a fan hinging off a corner needs", () => {
        expect(PlacementUtils.getOrigin({ ...RING, origin: { x: 0.5, y: 1.4 } })).toEqual({ x: 0.5, y: 1.4 });
    });
});

describe("pickIndex, by angle", () => {
    const pick = (x: number, y: number) => PlacementUtils.pickIndex({ layout: RING, point: { x, y } });

    it("picks the item the pointer is aimed at, not the one it is over", () => {
        expect(pick(0.5, 0.3), "a little way up from the middle is still aimed at the top item").toBe(0);
        expect(pick(0.5, 0.05), "and so is the far side of it").toBe(0);
    });

    it("picks from a gap, which is the whole reason it does not hit-test", () => {
        expect(pick(0.95, 0.05), "up and to the right, between two items and over neither").toBeDefined();
        expect([0, 1], "and it is one of the two it lies between").toContain(pick(0.95, 0.05));
    });

    it("picks from outside the box entirely, since only the direction matters", () => {
        expect(pick(0.5, -3), "far above the menu is still aimed at its top item").toBe(0);
    });

    it("crosses the wrap without noticing it", () => {
        const justBelowLeft = pick(0.05, 0.52);
        const justAboveLeft = pick(0.05, 0.48);

        expect(justBelowLeft, "either side of nine o'clock picks the item at nine o'clock").toBe(3);
        expect(justAboveLeft).toBe(3);
    });

    it("has nothing to pick when the pointer is on the origin itself, because there is no direction", () => {
        expect(pick(0.5, 0.5)).toBeUndefined();
    });

    it("passes over an item sitting on the origin, because it is the one place with no direction to aim at", () => {
        const withCentre: PlacementLayout = {
            ...RING,
            placements: [...RING.placements, { left: 0.5, top: 0.5, width: 0.4, height: 0.4 }],
        };
        const pickWithCentre = (x: number, y: number) =>
            PlacementUtils.pickIndex({ layout: withCentre, point: { x, y } });

        expect(pickWithCentre(0.9, 0.5), "aimed straight at the three o'clock item").toBe(1);
        expect(pickWithCentre(0.7, 0.48), "and just off it, where a centre item scoring zero would have won").toBe(1);
    });

    it("skips what it was told is not pickable, rather than picking it and being refused later", () => {
        const picked = PlacementUtils.pickIndex({
            layout: RING,
            point: { x: 0.5, y: 0.1 },
            isPickable: (index) => index !== 0,
        });

        expect(picked, "the top item is out, so the nearest direction that is left wins").not.toBe(0);
        expect(picked).toBeDefined();
    });
});

describe("pickIndex, by nearest", () => {
    const pick = (x: number, y: number) => PlacementUtils.pickIndex({ layout: SCATTER, point: { x, y } });

    it("picks whichever item's centre is closest", () => {
        expect(pick(0.12, 0.12)).toBe(0);
        expect(pick(0.85, 0.38)).toBe(1);
        expect(pick(0.48, 0.24)).toBe(2);
    });

    it("still picks something from a point that is over nothing at all", () => {
        expect(pick(0.7, 0.05)).toBeDefined();
    });

    it("is the default, so a layout that says nothing about picking still works", () => {
        expect(SCATTER.pickRule).toBeUndefined();
        expect(pick(0.12, 0.12)).toBe(0);
    });
});

describe("pickIndex, with nothing to pick", () => {
    it("has no answer for a layout with no placements in it", () => {
        expect(
            PlacementUtils.pickIndex({
                layout: { placements: [], heightRatio: 1 },
                point: { x: 0.5, y: 0.5 },
            }),
        ).toBeUndefined();
    });

    it("has no answer when everything has been ruled out", () => {
        expect(
            PlacementUtils.pickIndex({ layout: SCATTER, point: { x: 0.5, y: 0.25 }, isPickable: () => false }),
        ).toBeUndefined();
    });
});

describe("getGapPlacement", () => {
    const box = (left: number, top: number, angle?: number): PlacementRect => ({
        left,
        top,
        width: 0.2,
        height: 0.1,
        angle,
    });

    it("sits midway between the two borders rather than midway between the two centres", () => {
        const gap = PlacementUtils.getGapPlacement([box(0.2, 0.5), box(0.8, 0.5)], 1)!;

        expect(gap.left, "the centres are level, so the gap is level with them").toBeCloseTo(0.5);
        expect(gap.top).toBeCloseTo(0.5);
        expect(gap.width, "and it is as wide as what is left between the two facing edges").toBeCloseTo(0.4);
    });

    it("measures a smaller gap when the neighbours are wider, the centres being unmoved", () => {
        const narrow = PlacementUtils.getGapPlacement([box(0.2, 0.5), box(0.8, 0.5)], 1)!;
        const wide = PlacementUtils.getGapPlacement(
            [
                { ...box(0.2, 0.5), width: 0.4 },
                { ...box(0.8, 0.5), width: 0.4 },
            ],
            1,
        )!;

        expect(wide.left, "the gap is still between the same two centres").toBeCloseTo(narrow.left);
        expect(wide.width, "but there is less room left between them").toBeLessThan(narrow.width);
    });

    it("lies across the line joining the two, so a mark reads as a mark", () => {
        const level = PlacementUtils.getGapPlacement([box(0.2, 0.5), box(0.8, 0.5)], 1)!;
        const stacked = PlacementUtils.getGapPlacement([box(0.5, 0.2), box(0.5, 0.8)], 1)!;

        expect(level.angle, "two side by side are joined along the horizontal").toBeCloseTo(0);
        expect(stacked.angle, "and two stacked along the vertical, a quarter turn from it").toBeCloseTo(90);
    });

    it("reads a turned neighbour's own edge rather than the upright box it would have had", () => {
        const upright = PlacementUtils.getGapPlacement([box(0.2, 0.5), box(0.8, 0.5)], 1)!;
        const turned = PlacementUtils.getGapPlacement([box(0.2, 0.5, 90), box(0.8, 0.5)], 1)!;

        expect(
            turned.width,
            "turned a quarter, the box presents its short side to the join, so more room is left",
        ).toBeGreaterThan(upright.width);
    });

    it("puts the ends outside the outermost item, carrying a straight run straight on", () => {
        const placements = [box(0.2, 0.5), box(0.5, 0.5), box(0.8, 0.5)];
        const before = PlacementUtils.getGapPlacement(placements, 0)!;
        const after = PlacementUtils.getGapPlacement(placements, placements.length)!;

        expect(before.left, "the gap before the first sits on its far side").toBeLessThan(placements[0].left);
        expect(after.left, "and the one after the last on its far side").toBeGreaterThan(
            placements[placements.length - 1].left,
        );
        expect(after.angle, "a run in a line continues along it").toBeCloseTo(before.angle!);
    });

    it("carries a curved run round its own curve, not along its last straight line", () => {
        const ring = [box(0.5, 0.1), box(0.9, 0.5), box(0.5, 0.9), box(0.1, 0.5)];
        const after = PlacementUtils.getGapPlacement(ring, ring.length)!;
        const joinToFirst = PlacementUtils.getAngle(
            { x: ring[3].left, y: ring[3].top },
            { x: ring[0].left, y: ring[0].top },
        );

        expect(after.angle, "the last gap is aimed at where the ring comes back round to").toBeCloseTo(joinToFirst);
        expect(
            Math.abs(after.left - 0.3) + Math.abs(after.top - 0.3),
            "so it sits north-west of the box, between nine o'clock and twelve",
        ).toBeLessThan(0.1);
    });

    it("agrees with itself at the two ends of a closed run, both being the same gap", () => {
        const ring = [box(0.5, 0.1), box(0.9, 0.5), box(0.5, 0.9), box(0.1, 0.5)];
        const before = PlacementUtils.getGapPlacement(ring, 0)!;
        const after = PlacementUtils.getGapPlacement(ring, ring.length)!;

        expect(before.left, "before the first and after the last are one place on a ring").toBeCloseTo(after.left);
        expect(before.top).toBeCloseTo(after.top);
        expect(before.angle).toBeCloseTo(after.angle!);
    });

    it("has nothing to say about a list with no direction in it", () => {
        expect(
            PlacementUtils.getGapPlacement([box(0.5, 0.5)], 0),
            "one item leaves no gap to describe",
        ).toBeUndefined();
        expect(
            PlacementUtils.getGapPlacement([box(0.5, 0.5), box(0.5, 0.5)], 1),
            "and two in the same place leave no line to lie across",
        ).toBeUndefined();
    });
});
