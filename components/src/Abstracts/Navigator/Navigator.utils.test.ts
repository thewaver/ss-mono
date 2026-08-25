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

        expect(NavigatorUtils.computeNextPosition("ArrowDown", 0, LENGTH, { orientation: "row" })).toBeUndefined();
        expect(NavigatorUtils.computeNextPosition("ArrowRight", 0, LENGTH, { orientation: "row" })).toBe(1);
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

describe("computeNextCell", () => {
    const WEEK = { width: 7, height: 6 };

    it("steps along both axes", () => {
        expect(NavigatorUtils.computeNextCell("ArrowRight", { x: 2, y: 1 }, WEEK)).toEqual({ x: 3, y: 1 });
        expect(NavigatorUtils.computeNextCell("ArrowLeft", { x: 2, y: 1 }, WEEK)).toEqual({ x: 1, y: 1 });
        expect(NavigatorUtils.computeNextCell("ArrowDown", { x: 2, y: 1 }, WEEK)).toEqual({ x: 2, y: 2 });
        expect(NavigatorUtils.computeNextCell("ArrowUp", { x: 2, y: 1 }, WEEK)).toEqual({ x: 2, y: 0 });
    });

    it("carries past the end of a row into the start of the next, rather than wrapping in place", () => {
        expect(NavigatorUtils.computeNextCell("ArrowRight", { x: 6, y: 1 }, WEEK)).toEqual({ x: 0, y: 2 });
        expect(NavigatorUtils.computeNextCell("ArrowLeft", { x: 0, y: 1 }, WEEK)).toEqual({ x: 6, y: 0 });
    });

    it("lets the row leave the grid, which is how a caller knows to move its window", () => {
        expect(NavigatorUtils.computeNextCell("ArrowUp", { x: 3, y: 0 }, WEEK)).toEqual({ x: 3, y: -1 });
        expect(NavigatorUtils.computeNextCell("ArrowDown", { x: 3, y: 5 }, WEEK)).toEqual({ x: 3, y: 6 });
        expect(NavigatorUtils.computeNextCell("ArrowLeft", { x: 0, y: 0 }, WEEK)).toEqual({ x: 6, y: -1 });
    });

    it("reads the edge keys as the ends of the row, not of the grid", () => {
        expect(NavigatorUtils.computeNextCell("Home", { x: 4, y: 2 }, WEEK)).toEqual({ x: 0, y: 2 });
        expect(NavigatorUtils.computeNextCell("End", { x: 4, y: 2 }, WEEK)).toEqual({ x: 6, y: 2 });
    });

    it("pages by rows, and by a caller's own page size when it has one", () => {
        expect(NavigatorUtils.computeNextCell("PageDown", { x: 1, y: 0 }, WEEK)).toEqual({ x: 1, y: 6 });
        expect(NavigatorUtils.computeNextCell("PageUp", { x: 1, y: 0 }, WEEK)).toEqual({ x: 1, y: -6 });
        expect(NavigatorUtils.computeNextCell("PageDown", { x: 1, y: 0 }, WEEK, { pageRows: 2 })).toEqual({
            x: 1,
            y: 2,
        });
    });

    it("declines the keys a caller has taken over", () => {
        expect(NavigatorUtils.computeNextCell("PageDown", { x: 1, y: 0 }, WEEK, { hasPageKeys: false })).toBe(
            undefined,
        );
        expect(NavigatorUtils.computeNextCell("Home", { x: 1, y: 0 }, WEEK, { hasEdgeKeys: false })).toBe(undefined);
    });

    it("declines an empty grid rather than dividing by its width", () => {
        expect(NavigatorUtils.computeNextCell("ArrowRight", { x: 0, y: 0 }, { width: 0, height: 0 })).toBe(undefined);
    });
});
