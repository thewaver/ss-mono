import { describe, expect, it } from "vitest";

import type { SortableGridBox, SortableGridSpot } from "./SortableGrid.types";
import { SortableGridUtils } from "./SortableGrid.utils";

const box = (col: number, row: number, colCount: number, rowCount: number): SortableGridBox => ({
    spot: { col, row },
    size: { colCount, rowCount },
});

const at = (col: number, row: number): SortableGridSpot => ({ col, row });

const ELL = [at(0, 0), at(0, 1), at(0, 2), at(1, 2)];

const keys = (cells: SortableGridSpot[]) => cells.map((cell) => `${cell.col},${cell.row}`).sort();

const COLUMNS = 6;
const ROWS = 4;

const CELL = 10;
const GAP = 2;

describe("getCells", () => {
    it("expands a rectangle into every cell it covers", () => {
        expect(keys(SortableGridUtils.getCells({ colCount: 2, rowCount: 2 }))).toEqual(
            keys([at(0, 0), at(1, 0), at(0, 1), at(1, 1)]),
        );
    });

    it("takes a list as it is, moved so its top left corner is the origin", () => {
        expect(keys(SortableGridUtils.getCells([at(3, 5), at(4, 5)]))).toEqual(keys([at(0, 0), at(1, 0)]));
    });
});

describe("getTurnedCells", () => {
    it("turns a rectangle onto its side, which is the same either way round", () => {
        const cw = SortableGridUtils.getTurnedCells(SortableGridUtils.getCells({ colCount: 2, rowCount: 1 }), 1);
        const ccw = SortableGridUtils.getTurnedCells(SortableGridUtils.getCells({ colCount: 2, rowCount: 1 }), -1);

        expect(keys(cw)).toEqual(keys(ccw));
        expect(SortableGridUtils.getSize(cw)).toEqual({ colCount: 1, rowCount: 2 });
    });

    it("turns an L two different ways, which is the whole reason turns are counted rather than flagged", () => {
        const cw = SortableGridUtils.getTurnedCells(ELL, 1);
        const ccw = SortableGridUtils.getTurnedCells(ELL, -1);

        expect(keys(cw)).toEqual(keys([at(0, 0), at(1, 0), at(2, 0), at(0, 1)]));
        expect(keys(ccw)).toEqual(keys([at(2, 0), at(0, 1), at(1, 1), at(2, 1)]));
        expect(keys(cw)).not.toEqual(keys(ccw));
    });

    it("comes back to where it started after four", () => {
        expect(keys(SortableGridUtils.getTurnedCells(ELL, 4))).toEqual(keys(ELL));
    });

    it("counts backwards the same as forwards the other way", () => {
        expect(keys(SortableGridUtils.getTurnedCells(ELL, -1))).toEqual(keys(SortableGridUtils.getTurnedCells(ELL, 3)));
    });
});

describe("getIsInside", () => {
    it("takes a box that ends exactly on the last cell", () => {
        expect(SortableGridUtils.getIsInside(at(4, 2), { colCount: 2, rowCount: 2 }, COLUMNS, ROWS)).toBe(true);
    });

    it("refuses one that hangs off the right or the bottom", () => {
        expect(SortableGridUtils.getIsInside(at(5, 0), { colCount: 2, rowCount: 1 }, COLUMNS, ROWS)).toBe(false);
        expect(SortableGridUtils.getIsInside(at(0, 3), { colCount: 1, rowCount: 2 }, COLUMNS, ROWS)).toBe(false);
    });
});

describe("getIsFree", () => {
    it("lets an L nest into the notch of another shape, which a bounding box would refuse", () => {
        const shape = SortableGridUtils.getShape(ELL, 0);
        const placed = SortableGridUtils.getPlacedCells(at(1, 0), shape);

        expect(SortableGridUtils.getIsFree(placed, [at(1, 0)])).toBe(false);
        expect(SortableGridUtils.getIsFree(placed, [at(2, 0), at(2, 1)])).toBe(true);
    });
});

describe("getFreeSpot", () => {
    it("scans row by row, so the first answer is the topmost then the leftmost", () => {
        const shape = SortableGridUtils.getShape({ colCount: 1, rowCount: 1 }, 0);

        expect(SortableGridUtils.getFreeSpot(shape, COLUMNS, ROWS, [at(0, 0), at(1, 0)])).toEqual(at(2, 0));
    });

    it("answers with nothing when there is nowhere it fits", () => {
        const shape = SortableGridUtils.getShape({ colCount: 2, rowCount: 1 }, 0);

        expect(SortableGridUtils.getFreeSpot(shape, 1, 1, [])).toBeUndefined();
    });
});

describe("getNeighborIndex", () => {
    const BOXES = [box(0, 0, 1, 1), box(2, 0, 1, 1), box(0, 2, 1, 1), box(3, 3, 1, 1)];

    it("moves to the nearest box in the direction asked for", () => {
        expect(SortableGridUtils.getNeighborIndex(BOXES, 0, { col: 1, row: 0 })).toBe(1);
        expect(SortableGridUtils.getNeighborIndex(BOXES, 0, { col: 0, row: 1 })).toBe(2);
    });

    it("answers with nothing when there is nothing that way", () => {
        expect(SortableGridUtils.getNeighborIndex(BOXES, 0, { col: -1, row: 0 })).toBeUndefined();
    });
});

describe("getReadingOrder", () => {
    it("orders by row first and column second, whatever order the items were declared in", () => {
        expect(SortableGridUtils.getReadingOrder([box(3, 1, 1, 1), box(0, 1, 1, 1), box(2, 0, 1, 1)])).toEqual([
            2, 1, 0,
        ]);
    });
});

describe("getOutline", () => {
    it("draws a single cell as its own square", () => {
        expect(SortableGridUtils.getOutline([at(0, 0)], CELL, GAP)).toEqual([
            { x: 0, y: 0 },
            { x: CELL, y: 0 },
            { x: CELL, y: CELL },
            { x: 0, y: CELL },
        ]);
    });

    it("bridges the gap between two cells of one item rather than drawing two squares", () => {
        expect(SortableGridUtils.getOutline([at(0, 0), at(1, 0)], CELL, GAP)).toEqual([
            { x: 0, y: 0 },
            { x: CELL * 2 + GAP, y: 0 },
            { x: CELL * 2 + GAP, y: CELL },
            { x: 0, y: CELL },
        ]);
    });

    it("turns the corner of an L, and every point of it is a corner of the shape", () => {
        const outline = SortableGridUtils.getOutline([at(0, 0), at(0, 1), at(1, 1)], CELL, GAP);

        expect(outline).toEqual([
            { x: 0, y: 0 },
            { x: CELL, y: 0 },
            { x: CELL, y: CELL + GAP },
            { x: CELL * 2 + GAP, y: CELL + GAP },
            { x: CELL * 2 + GAP, y: CELL * 2 + GAP },
            { x: 0, y: CELL * 2 + GAP },
        ]);
    });
});

describe("getBlock", () => {
    it("takes the whole of a rectangle, so an even one centers properly", () => {
        expect(SortableGridUtils.getBlock(SortableGridUtils.getCells({ colCount: 2, rowCount: 2 }))).toEqual({
            spot: at(0, 0),
            size: { colCount: 2, rowCount: 2 },
        });
    });

    it("takes the long arm of an L rather than a corner cell", () => {
        expect(SortableGridUtils.getBlock(ELL)).toEqual({ spot: at(0, 0), size: { colCount: 1, rowCount: 3 } });
    });

    it("prefers the block nearest the shape's own center when several are the same size", () => {
        expect(SortableGridUtils.getBlock([at(0, 0), at(1, 0), at(1, 1), at(2, 1)])).toEqual({
            spot: at(1, 0),
            size: { colCount: 1, rowCount: 2 },
        });
    });
});
