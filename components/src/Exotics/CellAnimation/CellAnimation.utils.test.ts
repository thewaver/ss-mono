import { describe, expect, it } from "vitest";

import { CellAnimationUtils } from "./CellAnimation.utils";

describe("CellAnimationUtils", () => {
    it("reads parity off a whole-number distance", () => {
        expect(CellAnimationUtils.isEvenRow({ col: 0, row: 2 })).toBe(true);
        expect(CellAnimationUtils.isEvenRow({ col: 0, row: 3 })).toBe(false);
        expect(CellAnimationUtils.isEvenColumn({ col: 2, row: 0 })).toBe(true);
        expect(CellAnimationUtils.isEvenColumn({ col: 3, row: 0 })).toBe(false);
        expect(CellAnimationUtils.isEvenCheckered({ col: 1, row: 1 })).toBe(true);
        expect(CellAnimationUtils.isEvenCheckered({ col: 1, row: 2 })).toBe(false);
    });

    it("alternates parity on a half-integer distance rather than reading every step as odd", () => {
        expect(CellAnimationUtils.isEvenRow({ col: 0, row: 0.5 })).toBe(true);
        expect(CellAnimationUtils.isEvenRow({ col: 0, row: 1.5 })).toBe(false);
        expect(CellAnimationUtils.isEvenRow({ col: 0, row: 2.5 })).toBe(true);
    });

    it("treats a ring as even when neither axis is an odd inner step", () => {
        expect(CellAnimationUtils.isEvenRing({ col: 0, row: 0 })).toBe(true);
        expect(CellAnimationUtils.isEvenRing({ col: 1, row: 0 })).toBe(false);
        expect(CellAnimationUtils.isEvenRing({ col: 2, row: 2 })).toBe(true);
        expect(CellAnimationUtils.isEvenRing({ col: 3, row: 1 })).toBe(false);
    });

    it("rounds the count asked for and holds it between one cell and one per pixel", () => {
        expect(CellAnimationUtils.computeCellCount({ col: 2.6, row: 0 }, { width: 100, height: 50 })).toEqual({
            col: 3,
            row: 1,
        });
        expect(CellAnimationUtils.computeCellCount({ col: 500, row: 4 }, { width: 100, height: 50 }).col).toBe(100);
        expect(CellAnimationUtils.computeCellCount({ col: 4, row: 4 }, { width: 0, height: 0 })).toEqual({
            col: 1,
            row: 1,
        });
    });

    it("lays the lines between cells on whole pixels, from one side to the other", () => {
        expect(CellAnimationUtils.computeEdges(100, 3)).toEqual([0, 33, 67, 100]);
    });

    it("lets each cell reach a pixel past its far edges, so neighbors overlap", () => {
        expect(CellAnimationUtils.computeCellBounds([0, 50, 100], [0, 40], { col: 1, row: 0 })).toEqual({
            col: 50,
            row: 0,
            width: 51,
            height: 41,
        });
    });

    it("lists every cell in reading order, and counts a cell with no weight as none", () => {
        const defs = CellAnimationUtils.computeCellDefs({ col: 2, row: 2 }, [[0.5]]);

        expect(defs.map((cell) => cell.pos)).toEqual([
            { col: 0, row: 0 },
            { col: 1, row: 0 },
            { col: 0, row: 1 },
            { col: 1, row: 1 },
        ]);
        expect(defs.map((cell) => cell.weight)).toEqual([0.5, 0, 0, 0]);
    });

    it("quotes a source, since a drawn one carries parentheses an unquoted url refuses", () => {
        expect(CellAnimationUtils.toSourceImage("data:image/svg+xml,(x)")).toBe('url("data:image/svg+xml,(x)")');
    });

    it("keeps the cells up until the passes end, and then shows what the final frame asks for", () => {
        expect(CellAnimationUtils.computeFrameState(0, 1, "nothing")).toEqual({
            hasEnded: false,
            areCellsMounted: true,
            isSourceRevealed: false,
        });
        expect(CellAnimationUtils.computeFrameState(1, 1, "nothing").areCellsMounted).toBe(false);
        expect(CellAnimationUtils.computeFrameState(1, 1, "cells").areCellsMounted).toBe(true);
        expect(CellAnimationUtils.computeFrameState(1, 1, "source").isSourceRevealed).toBe(true);
    });

    it("sets the viewer off only once there is a size to set off from", () => {
        expect(CellAnimationUtils.computePerspective({ width: 0, height: 0 })).toBe("none");
        expect(CellAnimationUtils.computePerspective({ width: 100, height: 200 })).toBe("300px");
    });
});
