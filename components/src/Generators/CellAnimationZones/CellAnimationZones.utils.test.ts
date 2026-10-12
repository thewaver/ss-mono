import { describe, expect, it } from "vitest";

import type { Index2d, Size2d } from "@thewaver/ss-utils";

import { CellAnimationZoneUtils } from "./CellAnimationZones.utils";

const ODD_GRID: Index2d = { col: 7, row: 7 };
const CELL_SIZE: Size2d = { width: 10, height: 10 };

describe("CellAnimationZoneUtils", () => {
    const origin: Index2d = { col: 3, row: 3 };
    const inZone = (type: Parameters<typeof CellAnimationZoneUtils.isInZone>[0], pos: Index2d, weight = 0) =>
        CellAnimationZoneUtils.isInZone(type, { pos, origin, weight, count: ODD_GRID, size: CELL_SIZE });

    it("takes everything for the all zone", () => {
        expect(inZone("all", { col: 0, row: 0 })).toBe(true);
        expect(inZone("all", origin)).toBe(true);
    });

    it("splits the grid by side, excluding the origin's own row and column", () => {
        expect(inZone("top", { col: 3, row: 1 })).toBe(true);
        expect(inZone("top", { col: 3, row: 3 })).toBe(false);
        expect(inZone("bottom", { col: 3, row: 5 })).toBe(true);
        expect(inZone("left", { col: 1, row: 3 })).toBe(true);
        expect(inZone("right", { col: 5, row: 3 })).toBe(true);
    });

    it("numbers the quadrants counterclockwise from the top right", () => {
        expect(inZone("quadrant1", { col: 5, row: 1 })).toBe(true);
        expect(inZone("quadrant2", { col: 1, row: 1 })).toBe(true);
        expect(inZone("quadrant3", { col: 1, row: 5 })).toBe(true);
        expect(inZone("quadrant4", { col: 5, row: 5 })).toBe(true);
        expect(inZone("quadrant1", { col: 1, row: 5 })).toBe(false);
    });

    it("keeps the axes and the origin as their own zones", () => {
        expect(inZone("axis_x", { col: 0, row: 3 })).toBe(true);
        expect(inZone("axis_y", { col: 3, row: 0 })).toBe(true);
        expect(inZone("origin", origin)).toBe(true);
        expect(inZone("origin", { col: 3, row: 4 })).toBe(false);
        expect(inZone("axis1", { col: 3, row: 1 })).toBe(true);
        expect(inZone("axis4", { col: 3, row: 5 })).toBe(true);
    });

    it("pairs every parity zone with its exact complement", () => {
        for (const pos of [
            { col: 0, row: 0 },
            { col: 1, row: 2 },
            { col: 4, row: 5 },
            { col: 6, row: 3 },
        ]) {
            expect(inZone("even_rows", pos)).toBe(!inZone("odd_rows", pos));
            expect(inZone("even_columns", pos)).toBe(!inZone("odd_columns", pos));
            expect(inZone("even_rings", pos)).toBe(!inZone("odd_rings", pos));
            expect(inZone("even_checkered_cells", pos)).toBe(!inZone("odd_checkered_cells", pos));
        }
    });

    it("splits by weight at the halfway mark, with the boundary in the heavier half", () => {
        expect(inZone("lighter_half", origin, 0.49)).toBe(true);
        expect(inZone("lighter_half", origin, 0.5)).toBe(false);
        expect(inZone("heavier_half", origin, 0.5)).toBe(true);
    });
});
