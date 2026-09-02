import { describe, expect, it } from "vitest";

import type { SortableGridBox, SortableGridSpot } from "./SortableGrid.types";
import { SortableGridUtils } from "./SortableGrid.utils";

const box = (x: number, y: number, width: number, height: number): SortableGridBox => ({
    spot: { x, y },
    size: { width, height },
});

const at = (x: number, y: number): SortableGridSpot => ({ x, y });

/** The upright L used throughout: a column of three with a foot to the right of its bottom cell. */
const ELL = [at(0, 0), at(0, 1), at(0, 2), at(1, 2)];

const keys = (cells: SortableGridSpot[]) => cells.map((cell) => `${cell.x},${cell.y}`).sort();

const COLUMNS = 6;
const ROWS = 4;

const CELL = 10;
const GAP = 2;

describe("getCells", () => {
    it("expands a rectangle into every cell it covers", () => {
        expect(keys(SortableGridUtils.getCells({ width: 2, height: 2 }))).toEqual(
            keys([at(0, 0), at(1, 0), at(0, 1), at(1, 1)]),
        );
    });

    it("takes a list as it is, moved so its top left corner is the origin", () => {
        expect(keys(SortableGridUtils.getCells([at(3, 5), at(4, 5)]))).toEqual(keys([at(0, 0), at(1, 0)]));
    });
});

describe("getTurnedCells", () => {
    it("turns a rectangle onto its side, which is the same either way round", () => {
        const cw = SortableGridUtils.getTurnedCells(SortableGridUtils.getCells({ width: 2, height: 1 }), 1);
        const ccw = SortableGridUtils.getTurnedCells(SortableGridUtils.getCells({ width: 2, height: 1 }), -1);

        expect(keys(cw)).toEqual(keys(ccw));
        expect(SortableGridUtils.getSize(cw)).toEqual({ width: 1, height: 2 });
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
        expect(SortableGridUtils.getIsInside(at(4, 2), { width: 2, height: 2 }, COLUMNS, ROWS)).toBe(true);
    });

    it("refuses one that hangs off the right or the bottom", () => {
        expect(SortableGridUtils.getIsInside(at(5, 0), { width: 2, height: 1 }, COLUMNS, ROWS)).toBe(false);
        expect(SortableGridUtils.getIsInside(at(0, 3), { width: 1, height: 2 }, COLUMNS, ROWS)).toBe(false);
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
        const shape = SortableGridUtils.getShape({ width: 1, height: 1 }, 0);

        expect(SortableGridUtils.getFreeSpot(shape, COLUMNS, ROWS, [at(0, 0), at(1, 0)])).toEqual(at(2, 0));
    });

    it("answers with nothing when there is nowhere it fits", () => {
        const shape = SortableGridUtils.getShape({ width: 2, height: 1 }, 0);

        expect(SortableGridUtils.getFreeSpot(shape, 1, 1, [])).toBeUndefined();
    });
});

describe("getNeighbourIndex", () => {
    const BOXES = [box(0, 0, 1, 1), box(2, 0, 1, 1), box(0, 2, 1, 1), box(3, 3, 1, 1)];

    it("moves to the nearest box in the direction asked for", () => {
        expect(SortableGridUtils.getNeighbourIndex(BOXES, 0, { x: 1, y: 0 })).toBe(1);
        expect(SortableGridUtils.getNeighbourIndex(BOXES, 0, { x: 0, y: 1 })).toBe(2);
    });

    it("answers with nothing when there is nothing that way", () => {
        expect(SortableGridUtils.getNeighbourIndex(BOXES, 0, { x: -1, y: 0 })).toBeUndefined();
    });
});

describe("getReadingOrder", () => {
    it("orders by row first and column second, whatever order the items were declared in", () => {
        expect(SortableGridUtils.getReadingOrder([box(3, 1, 1, 1), box(0, 1, 1, 1), box(2, 0, 1, 1)])).toEqual([
            2, 1, 0,
        ]);
    });
});

/**
 * The outline is what a painter clips one continuous shape to, so it has to bridge the gap between two cells
 * of the same item while stopping short of it at the item's own edges — a shape that ran to the full pitch
 * would be one gap too wide and too tall.
 */
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

/**
 * The largest solid rectangle inside a shape is what a painter centres a glyph or a label on, since a shape
 * with a notch has no usable middle of its own — the middle of an L's bounding box is the hole.
 */
describe("getBlock", () => {
    it("takes the whole of a rectangle, so an even one centres properly", () => {
        expect(SortableGridUtils.getBlock(SortableGridUtils.getCells({ width: 2, height: 2 }))).toEqual({
            spot: at(0, 0),
            size: { width: 2, height: 2 },
        });
    });

    it("takes the long arm of an L rather than a corner cell", () => {
        expect(SortableGridUtils.getBlock(ELL)).toEqual({ spot: at(0, 0), size: { width: 1, height: 3 } });
    });

    it("prefers the block nearest the shape's own centre when several are the same size", () => {
        expect(SortableGridUtils.getBlock([at(0, 0), at(1, 0), at(1, 1), at(2, 1)])).toEqual({
            spot: at(1, 0),
            size: { width: 1, height: 2 },
        });
    });
});
