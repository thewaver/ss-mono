import { describe, expect, it } from "vitest";

import { SegmentedInputUtils } from "./SegmentedInput.utils";

const CELLS = [
    { left: 0, right: 40 },
    { left: 50, right: 90 },
    { left: 100, right: 140 },
];

describe("findCellIndex", () => {
    it("finds the cell a point falls in", () => {
        expect(SegmentedInputUtils.findCellIndex(20, CELLS)).toBe(0);
        expect(SegmentedInputUtils.findCellIndex(120, CELLS)).toBe(2);
    });

    it("gives a point between cells or past the row to the nearest cell", () => {
        expect(SegmentedInputUtils.findCellIndex(47, CELLS)).toBe(1);
        expect(SegmentedInputUtils.findCellIndex(-30, CELLS)).toBe(0);
        expect(SegmentedInputUtils.findCellIndex(500, CELLS)).toBe(2);
    });

    it("gives a point equally near two cells to the first", () => {
        expect(SegmentedInputUtils.findCellIndex(45, CELLS)).toBe(0);
    });

    it("answers the first cell when there are none", () => {
        expect(SegmentedInputUtils.findCellIndex(10, [])).toBe(0);
    });
});

describe("computeCellRange", () => {
    it("selects the character in one cell", () => {
        expect(SegmentedInputUtils.computeCellRange(2, 2, 4)).toEqual({ start: 2, end: 3 });
    });

    it("covers a run of cells whichever way it was dragged", () => {
        expect(SegmentedInputUtils.computeCellRange(0, 2, 6)).toEqual({ start: 0, end: 3 });
        expect(SegmentedInputUtils.computeCellRange(2, 0, 6)).toEqual({ start: 0, end: 3 });
    });

    it("puts the caret after the last character for a cell past the value", () => {
        expect(SegmentedInputUtils.computeCellRange(5, 5, 2)).toEqual({ start: 2, end: 2 });
    });

    it("stops a run that reaches past the value at its last character", () => {
        expect(SegmentedInputUtils.computeCellRange(1, 5, 3)).toEqual({ start: 1, end: 3 });
    });
});

describe("computeCellFlags", () => {
    const focused = (start: number, end: number) => ({ isFocused: true, selection: { start, end }, cellCount: 6 });

    it("gives the caret to the cell the next character lands in", () => {
        expect(SegmentedInputUtils.computeCellFlags(2, focused(2, 2)).hasCaret).toBe(true);
        expect(SegmentedInputUtils.computeCellFlags(1, focused(2, 2)).hasCaret).toBe(false);
    });

    it("keeps the caret on the last cell of a full field", () => {
        expect(SegmentedInputUtils.computeCellFlags(5, focused(6, 6)).hasCaret).toBe(true);
    });

    it("marks the cells inside a selection, and none for a bare caret", () => {
        expect(SegmentedInputUtils.computeCellFlags(3, focused(3, 5)).isSelected).toBe(true);
        expect(SegmentedInputUtils.computeCellFlags(5, focused(3, 5)).isSelected).toBe(false);
        expect(SegmentedInputUtils.computeCellFlags(3, focused(3, 3)).isSelected).toBe(false);
    });

    it("shows neither while the field is unfocused", () => {
        expect(
            SegmentedInputUtils.computeCellFlags(3, {
                isFocused: false,
                selection: { start: 3, end: 5 },
                cellCount: 6,
            }),
        ).toEqual({ hasCaret: false, isSelected: false });
    });
});
