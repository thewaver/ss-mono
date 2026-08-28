import { describe, expect, it } from "vitest";

import { SortableUtils } from "./Sortable.utils";

const rect = (left: number, top: number, width: number, height: number) =>
    ({ left, top, width, height, right: left + width, bottom: top + height }) as DOMRect;

const ROW = [rect(0, 0, 100, 40), rect(100, 0, 100, 40), rect(200, 0, 100, 40)];
const COLUMN = [rect(0, 0, 100, 40), rect(0, 40, 100, 40), rect(0, 80, 100, 40)];

describe("computeDropIndex", () => {
    it("lands before an item while the pointer is in its leading half", () => {
        expect(SortableUtils.computeDropIndex(ROW, 10, 20, "row")).toBe(0);
        expect(SortableUtils.computeDropIndex(ROW, 120, 20, "row")).toBe(1);
    });

    it("lands after an item once the pointer passes its middle", () => {
        expect(SortableUtils.computeDropIndex(ROW, 60, 20, "row")).toBe(1);
        expect(SortableUtils.computeDropIndex(ROW, 160, 20, "row")).toBe(2);
    });

    it("lands past the end when the pointer is beyond every item", () => {
        expect(SortableUtils.computeDropIndex(ROW, 400, 20, "row")).toBe(3);
        expect(SortableUtils.computeDropIndex(COLUMN, 50, 400, "column")).toBe(3);
    });

    it("reads the axis it was given rather than the one the rects suggest", () => {
        expect(SortableUtils.computeDropIndex(COLUMN, 50, 10, "column")).toBe(0);
        expect(SortableUtils.computeDropIndex(COLUMN, 50, 50, "column")).toBe(1);
    });

    it("puts an empty container's only landing place at nought", () => {
        expect(SortableUtils.computeDropIndex([], 50, 50, "row")).toBe(0);
    });
});

describe("computeSettledIndex", () => {
    it("shifts a within-container move down by one, because the item leaves before it arrives", () => {
        expect(SortableUtils.computeSettledIndex(3, 0, true)).toBe(2);
    });

    it("leaves a move towards the front alone, since nothing before it has been removed", () => {
        expect(SortableUtils.computeSettledIndex(1, 3, true)).toBe(1);
    });

    it("leaves a move to another container alone whatever the indexes are", () => {
        expect(SortableUtils.computeSettledIndex(3, 0, false)).toBe(3);
    });
});

describe("computeMarkerIndex", () => {
    it("draws the marker after the carried item when it would land at or beyond its own place", () => {
        expect(SortableUtils.computeMarkerIndex(2, 2, true)).toBe(3);
        expect(SortableUtils.computeMarkerIndex(4, 2, true)).toBe(5);
    });

    it("draws it where it says when the landing is before the carried item", () => {
        expect(SortableUtils.computeMarkerIndex(1, 2, true)).toBe(1);
    });

    it("draws it where it says in another container, which is not holding the item", () => {
        expect(SortableUtils.computeMarkerIndex(2, 0, false)).toBe(2);
    });
});
