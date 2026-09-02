import { describe, expect, it } from "vitest";

import { ScratchCardUtils } from "./ScratchCard.utils";

const GRID = { x: 4, y: 4 };
const SIZE = { width: 400, height: 400 };

const brush = (x: number, y: number, radius: number, cellCount = GRID) =>
    ScratchCardUtils.computeBrushedCells({ point: { x, y }, size: SIZE, cellCount, radius });

describe("computeBrushedCells", () => {
    it("takes the one cell the pointer is in when the brush is smaller than a cell", () => {
        expect(brush(50, 50, 10)).toEqual([0]);
    });

    it("always takes the cell the pointer is in, however small the brush", () => {
        expect(brush(120, 130, 0), "a cell is brushed when the circle touches its box, not its centre").toEqual([5]);
    });

    it("takes a round patch rather than the square the search walked", () => {
        const patch = brush(200, 200, 110);

        expect(patch, "the four cells meeting under the pointer are all in it").toEqual(
            expect.arrayContaining([5, 6, 9, 10]),
        );
        expect(patch, "the far corner is outside the circle even though it is inside the square").not.toContain(0);
        expect(patch.length, "and it is not simply the whole board").toBeLessThan(16);
    });

    it("reaches further as the brush grows, and never the same cell twice", () => {
        const wide = brush(200, 200, 160);

        expect(wide.length).toBeGreaterThan(brush(200, 200, 110).length);
        expect(new Set(wide).size, "a cell is listed once however the search reached it").toBe(wide.length);
    });

    it("stays inside the grid when the pointer is at a corner", () => {
        const corner = brush(0, 0, 200);

        expect(
            corner.every((index) => index >= 0 && index < 16),
            "no cell outside the board is named",
        ).toBe(true);
        expect(corner, "and the cell under the corner is one of them").toContain(0);
    });

    it("measures in pixels rather than in cells, so a finer grid brushes more of them", () => {
        const coarse = brush(200, 200, 60);
        const fine = brush(200, 200, 60, { x: 16, y: 16 });

        expect(coarse.length).toBeGreaterThan(0);
        expect(fine.length, "the same coin covers more of a finer cover").toBeGreaterThan(coarse.length);
    });

    it("has nothing to brush when the grid has no cells", () => {
        expect(brush(10, 10, 50, { x: 0, y: 0 })).toEqual([]);
    });
});

describe("getCellPosition", () => {
    it("reads an index back as a row and a column", () => {
        expect(ScratchCardUtils.getCellPosition(6, GRID)).toEqual({ x: 2, y: 1 });
    });
});

describe("computeClearedRatio", () => {
    it("reports how much of the cover has gone", () => {
        expect(ScratchCardUtils.computeClearedRatio(4, GRID)).toBe(0.25);
    });

    it("never reports more than the whole of it", () => {
        expect(ScratchCardUtils.computeClearedRatio(40, GRID)).toBe(1);
    });

    it("reports nothing cleared when there was nothing to clear", () => {
        expect(ScratchCardUtils.computeClearedRatio(0, { x: 0, y: 0 })).toBe(0);
    });
});
