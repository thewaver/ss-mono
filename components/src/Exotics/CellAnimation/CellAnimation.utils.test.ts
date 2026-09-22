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
});
