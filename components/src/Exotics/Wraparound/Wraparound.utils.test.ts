import { describe, expect, it } from "vitest";

import { WraparoundUtils } from "./Wraparound.utils";

const TILE = { width: 100, height: 50 };
const VIEW = { width: 250, height: 120 };
const ORIGINAL = { column: 0, row: 0 };

describe("WraparoundUtils.computeTiles", () => {
    it("covers the window with copies and leaves out the original's cell", () => {
        const tiles = WraparoundUtils.computeTiles({ x: 0, y: 0 }, TILE, VIEW, ORIGINAL, 100);

        expect(tiles).toHaveLength(3 * 3 - 1);
        expect(tiles).not.toContainEqual(ORIGINAL);
        expect(tiles).toContainEqual({ column: 2, row: 2 });
    });

    it("reaches cells to the left and above once the plane has moved the other way", () => {
        const tiles = WraparoundUtils.computeTiles({ x: 30, y: 20 }, TILE, VIEW, ORIGINAL, 100);

        expect(tiles).toContainEqual({ column: -1, row: -1 });
        expect(tiles).toContainEqual({ column: 2, row: 1 });
        expect(tiles, "the bottom row has moved out of the window").not.toContainEqual({ column: 0, row: 2 });
    });

    it("draws a copy where the original would be, once the original has moved to another cell", () => {
        const tiles = WraparoundUtils.computeTiles({ x: 0, y: 0 }, TILE, VIEW, { column: 5, row: 5 }, 100);

        expect(tiles).toContainEqual(ORIGINAL);
    });

    it("draws nothing for content with no size, and stops at the limit", () => {
        expect(WraparoundUtils.computeTiles({ x: 0, y: 0 }, { width: 0, height: 50 }, VIEW, ORIGINAL, 100)).toEqual([]);
        expect(WraparoundUtils.computeTiles({ x: 0, y: 0 }, { width: 1, height: 1 }, VIEW, ORIGINAL, 10)).toHaveLength(
            10,
        );
    });
});

describe("WraparoundUtils.findTileAt", () => {
    it("counts cells from the plane's offset, below zero as well as above", () => {
        expect(WraparoundUtils.findTileAt({ x: 10, y: 10 }, { x: 30, y: 0 }, TILE)).toEqual({ column: -1, row: 0 });
        expect(WraparoundUtils.findTileAt({ x: 230, y: 60 }, { x: 30, y: 0 }, TILE)).toEqual({ column: 2, row: 1 });
    });
});

describe("WraparoundUtils.computeReveal", () => {
    it("leaves a part already in view where it is", () => {
        const { shift, delta } = WraparoundUtils.computeReveal(
            { x: 0, y: 0 },
            { x: 10, y: 10, width: 20, height: 20 },
            TILE,
            VIEW,
        );

        expect(shift).toEqual({ column: 0, row: 0 });
        expect(delta).toEqual({ x: 0, y: 0 });
    });

    it("hands the original another cell rather than moving the plane, when that cell is already in view", () => {
        const { shift, delta } = WraparoundUtils.computeReveal(
            { x: -400, y: 0 },
            { x: 10, y: 10, width: 20, height: 20 },
            TILE,
            VIEW,
        );

        expect(shift.column, "the nearest cell that needs no move").toBe(4);
        expect(delta).toEqual({ x: 0, y: 0 });
    });

    it("moves just far enough to show a part cut by the edge", () => {
        const { delta } = WraparoundUtils.computeReveal(
            { x: 0, y: 0 },
            { x: 80, y: 0, width: 20, height: 140 },
            { width: 100, height: 400 },
            VIEW,
        );

        expect(delta.x).toBe(0);
        expect(delta.y, "a part taller than the window shows its top edge").toBe(0);
    });

    it("pulls a part hanging over the far edge back by the overhang", () => {
        const { delta } = WraparoundUtils.computeReveal(
            { x: 0, y: 0 },
            { x: 0, y: 100, width: 20, height: 40 },
            { width: 100, height: 400 },
            VIEW,
        );

        expect(delta.y).toBe(120 - 140);
    });
});

describe("WraparoundUtils.computeVelocity", () => {
    it("reads the speed over the last stretch of the drag only", () => {
        const velocity = WraparoundUtils.computeVelocity([
            { point: { x: 0, y: 0 }, timeMs: 0 },
            { point: { x: 500, y: 0 }, timeMs: 400 },
            { point: { x: 600, y: 50 }, timeMs: 450 },
        ]);

        expect(velocity).toEqual({ x: 2, y: 1 });
    });

    it("answers none for a single sample", () => {
        expect(WraparoundUtils.computeVelocity([{ point: { x: 0, y: 0 }, timeMs: 0 }])).toEqual({ x: 0, y: 0 });
    });
});

describe("WraparoundUtils.stepCoast", () => {
    it("travels the sum of a speed that decays, and keeps the share it should", () => {
        const step = WraparoundUtils.stepCoast({ x: 1, y: 0 }, 100, 100);

        expect(step.velocity.x).toBeCloseTo(Math.exp(-1));
        expect(step.distance.x).toBeCloseTo(100 * (1 - Math.exp(-1)));
    });

    it("lands in the same place however the time is cut into frames", () => {
        const whole = WraparoundUtils.stepCoast({ x: 1, y: 0 }, 160, 200);
        const first = WraparoundUtils.stepCoast({ x: 1, y: 0 }, 80, 200);
        const second = WraparoundUtils.stepCoast(first.velocity, 80, 200);

        expect(first.distance.x + second.distance.x).toBeCloseTo(whole.distance.x);
    });

    it("stops dead without momentum", () => {
        expect(WraparoundUtils.stepCoast({ x: 3, y: 3 }, 16, 0)).toEqual({
            distance: { x: 0, y: 0 },
            velocity: { x: 0, y: 0 },
        });
    });
});

describe("WraparoundUtils.computeKeyDelta", () => {
    it("moves the plane against the key, the way a scrolled page moves", () => {
        expect(WraparoundUtils.computeKeyDelta("ArrowRight", 40, VIEW)).toEqual({ x: -40, y: 0 });
        expect(WraparoundUtils.computeKeyDelta("ArrowUp", 40, VIEW)).toEqual({ x: 0, y: 40 });
        expect(WraparoundUtils.computeKeyDelta("PageDown", 40, VIEW)?.y).toBeCloseTo(-108);
        expect(WraparoundUtils.computeKeyDelta("a", 40, VIEW)).toBeUndefined();
    });
});
