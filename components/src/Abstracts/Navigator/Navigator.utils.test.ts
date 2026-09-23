import { describe, expect, it } from "vitest";

import { NavigatorUtils } from "./Navigator.utils";

const LENGTH = 5;

describe("computeNextPosition", () => {
    it("steps a column list with the vertical arrows", () => {
        expect(NavigatorUtils.computeNextPosition("ArrowDown", 0, LENGTH)).toBe(1);
        expect(NavigatorUtils.computeNextPosition("ArrowUp", 3, LENGTH)).toBe(2);
    });

    it("wraps at both ends rather than stopping", () => {
        expect(NavigatorUtils.computeNextPosition("ArrowDown", LENGTH - 1, LENGTH)).toBe(0);
        expect(NavigatorUtils.computeNextPosition("ArrowUp", 0, LENGTH)).toBe(LENGTH - 1);
    });

    it("ignores the cross-axis arrows, which is what the orientation is for", () => {
        expect(NavigatorUtils.computeNextPosition("ArrowRight", 0, LENGTH)).toBeUndefined();
        expect(NavigatorUtils.computeNextPosition("ArrowLeft", 0, LENGTH)).toBeUndefined();

        expect(
            NavigatorUtils.computeNextPosition("ArrowDown", 0, LENGTH, { orientation: "horizontal" }),
        ).toBeUndefined();
        expect(NavigatorUtils.computeNextPosition("ArrowRight", 0, LENGTH, { orientation: "horizontal" })).toBe(1);
    });

    it("takes either axis when the orientation is both", () => {
        const opts = { orientation: "both" } as const;

        expect(NavigatorUtils.computeNextPosition("ArrowRight", 0, LENGTH, opts)).toBe(1);
        expect(NavigatorUtils.computeNextPosition("ArrowDown", 0, LENGTH, opts)).toBe(1);
        expect(NavigatorUtils.computeNextPosition("ArrowLeft", 0, LENGTH, opts)).toBe(LENGTH - 1);
        expect(NavigatorUtils.computeNextPosition("ArrowUp", 0, LENGTH, opts)).toBe(LENGTH - 1);
    });

    it("jumps to either end on Home and End", () => {
        expect(NavigatorUtils.computeNextPosition("Home", 3, LENGTH)).toBe(0);
        expect(NavigatorUtils.computeNextPosition("End", 3, LENGTH)).toBe(LENGTH - 1);
    });

    it("leaves Home and End alone when the consumer needs them for something else", () => {
        const opts = { hasEdgeKeys: false };

        expect(NavigatorUtils.computeNextPosition("Home", 3, LENGTH, opts)).toBeUndefined();
        expect(NavigatorUtils.computeNextPosition("End", 3, LENGTH, opts)).toBeUndefined();
        expect(NavigatorUtils.computeNextPosition("ArrowDown", 3, LENGTH, opts)).toBe(4);
    });

    it("answers nothing for a key it does not handle, so the consumer can let the event through", () => {
        expect(NavigatorUtils.computeNextPosition("Enter", 0, LENGTH)).toBeUndefined();
        expect(NavigatorUtils.computeNextPosition("a", 0, LENGTH)).toBeUndefined();
    });

    it("answers nothing for an empty collection rather than an out-of-range index", () => {
        expect(NavigatorUtils.computeNextPosition("ArrowDown", 0, 0)).toBeUndefined();
        expect(NavigatorUtils.computeNextPosition("Home", 0, 0)).toBeUndefined();
        expect(NavigatorUtils.computeNextPosition("End", 0, 0)).toBeUndefined();
    });

    it("stays put in a collection of one, where every move wraps onto itself", () => {
        expect(NavigatorUtils.computeNextPosition("ArrowDown", 0, 1)).toBe(0);
        expect(NavigatorUtils.computeNextPosition("ArrowUp", 0, 1)).toBe(0);
        expect(NavigatorUtils.computeNextPosition("End", 0, 1)).toBe(0);
    });

    it("wraps from a starting index that is already out of range", () => {
        expect(NavigatorUtils.computeNextPosition("ArrowDown", LENGTH + 2, LENGTH)).toBe(3);
        expect(NavigatorUtils.computeNextPosition("ArrowUp", -1, LENGTH)).toBe(3);
    });
});

describe("computeNextPosition in a right-to-left layout", () => {
    const opts = { orientation: "horizontal", direction: "rtl" } as const;

    it("steps forward on the left arrow and back on the right", () => {
        expect(NavigatorUtils.computeNextPosition("ArrowLeft", 0, LENGTH, opts)).toBe(1);
        expect(NavigatorUtils.computeNextPosition("ArrowRight", 0, LENGTH, opts)).toBe(LENGTH - 1);
    });

    it("leaves the vertical arrows, Home and End as they are", () => {
        const both = { orientation: "both", direction: "rtl" } as const;

        expect(NavigatorUtils.computeNextPosition("ArrowDown", 0, LENGTH, both)).toBe(1);
        expect(NavigatorUtils.computeNextPosition("ArrowUp", 0, LENGTH, both)).toBe(LENGTH - 1);
        expect(NavigatorUtils.computeNextPosition("Home", 3, LENGTH, opts)).toBe(0);
        expect(NavigatorUtils.computeNextPosition("End", 3, LENGTH, opts)).toBe(LENGTH - 1);
    });

    it("mirrors only the two horizontal arrows when a key is read through it", () => {
        expect(NavigatorUtils.computeLogicalKey("ArrowLeft", "rtl")).toBe("ArrowRight");
        expect(NavigatorUtils.computeLogicalKey("ArrowRight", "rtl")).toBe("ArrowLeft");
        expect(NavigatorUtils.computeLogicalKey("ArrowDown", "rtl")).toBe("ArrowDown");
        expect(NavigatorUtils.computeLogicalKey("ArrowLeft", "ltr")).toBe("ArrowLeft");
        expect(NavigatorUtils.computeLogicalKey("ArrowLeft", undefined)).toBe("ArrowLeft");
    });
});

describe("computeNextPosition without looping", () => {
    const opts = { isLooping: false };

    it("stays on the last item going forward and on the first going back", () => {
        expect(NavigatorUtils.computeNextPosition("ArrowDown", LENGTH - 1, LENGTH, opts)).toBe(LENGTH - 1);
        expect(NavigatorUtils.computeNextPosition("ArrowUp", 0, LENGTH, opts)).toBe(0);
    });

    it("still steps between the ends and still jumps on Home and End", () => {
        expect(NavigatorUtils.computeNextPosition("ArrowDown", 1, LENGTH, opts)).toBe(2);
        expect(NavigatorUtils.computeNextPosition("Home", 3, LENGTH, opts)).toBe(0);
        expect(NavigatorUtils.computeNextPosition("End", 1, LENGTH, opts)).toBe(LENGTH - 1);
    });
});

describe("computeNextCell", () => {
    const WEEK = { rowCount: 6, colCount: 7 };

    it("steps along both axes", () => {
        expect(NavigatorUtils.computeNextCell("ArrowRight", { row: 1, col: 2 }, WEEK)).toEqual({ row: 1, col: 3 });
        expect(NavigatorUtils.computeNextCell("ArrowLeft", { row: 1, col: 2 }, WEEK)).toEqual({ row: 1, col: 1 });
        expect(NavigatorUtils.computeNextCell("ArrowDown", { row: 1, col: 2 }, WEEK)).toEqual({ row: 2, col: 2 });
        expect(NavigatorUtils.computeNextCell("ArrowUp", { row: 1, col: 2 }, WEEK)).toEqual({ row: 0, col: 2 });
    });

    it("carries past the end of a row into the start of the next, rather than wrapping in place", () => {
        expect(NavigatorUtils.computeNextCell("ArrowRight", { row: 1, col: 6 }, WEEK)).toEqual({ row: 2, col: 0 });
        expect(NavigatorUtils.computeNextCell("ArrowLeft", { row: 1, col: 0 }, WEEK)).toEqual({ row: 0, col: 6 });
    });

    it("lets the row leave the grid, which is how a caller knows to move its window", () => {
        expect(NavigatorUtils.computeNextCell("ArrowUp", { row: 0, col: 3 }, WEEK)).toEqual({ row: -1, col: 3 });
        expect(NavigatorUtils.computeNextCell("ArrowDown", { row: 5, col: 3 }, WEEK)).toEqual({ row: 6, col: 3 });
        expect(NavigatorUtils.computeNextCell("ArrowLeft", { row: 0, col: 0 }, WEEK)).toEqual({ row: -1, col: 6 });
    });

    it("reads the edge keys as the ends of the row, not of the grid", () => {
        expect(NavigatorUtils.computeNextCell("Home", { row: 2, col: 4 }, WEEK)).toEqual({ row: 2, col: 0 });
        expect(NavigatorUtils.computeNextCell("End", { row: 2, col: 4 }, WEEK)).toEqual({ row: 2, col: 6 });
    });

    it("pages by rows, and by a caller's own page size when it has one", () => {
        expect(NavigatorUtils.computeNextCell("PageDown", { row: 0, col: 1 }, WEEK)).toEqual({ row: 6, col: 1 });
        expect(NavigatorUtils.computeNextCell("PageUp", { row: 0, col: 1 }, WEEK)).toEqual({ row: -6, col: 1 });
        expect(NavigatorUtils.computeNextCell("PageDown", { row: 0, col: 1 }, WEEK, { pageRows: 2 })).toEqual({
            row: 2,
            col: 1,
        });
    });

    it("declines the keys a caller has taken over", () => {
        expect(NavigatorUtils.computeNextCell("PageDown", { row: 0, col: 1 }, WEEK, { hasPageKeys: false })).toBe(
            undefined,
        );
        expect(NavigatorUtils.computeNextCell("Home", { row: 0, col: 1 }, WEEK, { hasEdgeKeys: false })).toBe(
            undefined,
        );
    });

    it("flips the horizontal arrows under right-to-left and leaves the rest alone", () => {
        const opts = { direction: "rtl" as const };

        expect(NavigatorUtils.computeNextCell("ArrowRight", { row: 1, col: 2 }, WEEK, opts)).toEqual({
            row: 1,
            col: 1,
        });
        expect(NavigatorUtils.computeNextCell("ArrowLeft", { row: 1, col: 2 }, WEEK, opts)).toEqual({ row: 1, col: 3 });
        expect(NavigatorUtils.computeNextCell("ArrowRight", { row: 1, col: 0 }, WEEK, opts)).toEqual({
            row: 0,
            col: 6,
        });
        expect(NavigatorUtils.computeNextCell("ArrowLeft", { row: 1, col: 6 }, WEEK, opts)).toEqual({ row: 2, col: 0 });
        expect(NavigatorUtils.computeNextCell("ArrowDown", { row: 1, col: 2 }, WEEK, opts)).toEqual({ row: 2, col: 2 });
        expect(NavigatorUtils.computeNextCell("Home", { row: 2, col: 4 }, WEEK, opts)).toEqual({ row: 2, col: 0 });
    });

    it("declines an empty grid rather than dividing by its column count", () => {
        expect(NavigatorUtils.computeNextCell("ArrowRight", { row: 0, col: 0 }, { rowCount: 0, colCount: 0 })).toBe(
            undefined,
        );
    });
});
