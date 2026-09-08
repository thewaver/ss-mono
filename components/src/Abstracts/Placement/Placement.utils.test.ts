import { describe, expect, it } from "vitest";

import type { PlacementLayout } from "./Placement.types";
import { PlacementUtils } from "./Placement.utils";

// four items round a square box, at twelve, three, six and nine o'clock
const RING: PlacementLayout = {
    width: 300,
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
    width: 300,
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
            PlacementUtils.pickIndex({ layout: { placements: [], width: 300, heightRatio: 1 }, point: { x: 0.5, y: 0.5 } }),
        ).toBeUndefined();
    });

    it("has no answer when everything has been ruled out", () => {
        expect(
            PlacementUtils.pickIndex({ layout: SCATTER, point: { x: 0.5, y: 0.25 }, isPickable: () => false }),
        ).toBeUndefined();
    });
});
