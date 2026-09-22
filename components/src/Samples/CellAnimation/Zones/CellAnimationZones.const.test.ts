import { describe, expect, it } from "vitest";

import type { Index2d, Size2d } from "@thewaver/ss-utils";

import { CellAnimationZones } from "./CellAnimationZones.const";

const ODD_GRID: Index2d = { col: 7, row: 7 };
const CELL_SIZE: Size2d = { width: 10, height: 10 };

describe("CellAnimationZonesConst", () => {
    const origin: Index2d = { col: 3, row: 3 };
    const inZone = (type: Parameters<typeof CellAnimationZones.isInZone>[0], pos: Index2d, weight = 0) =>
        CellAnimationZones.isInZone(type, { pos, origin, weight, count: ODD_GRID, size: CELL_SIZE });

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

    it("numbers the quadrants anticlockwise from the top right", () => {
        expect(inZone("quadrant1", { col: 5, row: 1 })).toBe(true);
        expect(inZone("quadrant2", { col: 1, row: 1 })).toBe(true);
        expect(inZone("quadrant3", { col: 1, row: 5 })).toBe(true);
        expect(inZone("quadrant4", { col: 5, row: 5 })).toBe(true);
        expect(inZone("quadrant1", { col: 1, row: 5 })).toBe(false);
    });

    it("keeps the axes and the origin as their own zones", () => {
        expect(inZone("axisX", { col: 0, row: 3 })).toBe(true);
        expect(inZone("axisY", { col: 3, row: 0 })).toBe(true);
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
            expect(inZone("evenRows", pos)).toBe(!inZone("oddRows", pos));
            expect(inZone("evenColumns", pos)).toBe(!inZone("oddColumns", pos));
            expect(inZone("evenRings", pos)).toBe(!inZone("oddRings", pos));
            expect(inZone("evenCheckeredCells", pos)).toBe(!inZone("oddCheckeredCells", pos));
        }
    });

    it("splits by weight at the halfway mark, with the boundary in the heavier half", () => {
        expect(inZone("lighterHalf", origin, 0.49)).toBe(true);
        expect(inZone("lighterHalf", origin, 0.5)).toBe(false);
        expect(inZone("heavierHalf", origin, 0.5)).toBe(true);
    });
});
