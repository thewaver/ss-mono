import { describe, expect, it } from "vitest";

import { Index2d, Index2dString } from "../../src/Abstracts/index2d.js";

const a = { row: 3, col: 4 };
const b = { row: 1, col: 8 };

describe("Index2d", () => {
    it("does arithmetic under row/col", () => {
        expect(Index2d.add(a, b)).toEqual({ row: 4, col: 12 });
        expect(Index2d.sub(a, b)).toEqual({ row: 2, col: -4 });
        expect(Index2d.mul(a, b)).toEqual({ row: 3, col: 32 });
        expect(Index2d.div(a, b)).toEqual({ row: 3, col: 0.5 });
    });

    it("takes the smaller or larger of each tally", () => {
        expect(Index2d.min(a, b)).toEqual({ row: 1, col: 4 });
        expect(Index2d.max(a, b)).toEqual({ row: 3, col: 8 });
        expect(Index2d.max(undefined, b)).toBeUndefined();
    });

    it("compares field by field", () => {
        expect(Index2d.isSame(a, { ...a })).toBe(true);
        expect(Index2d.isSame(a, b)).toBe(false);
        expect(Index2d.isSame(undefined, undefined)).toBe(false);
    });

    it("round-trips through a string key", () => {
        expect(Index2d.toString(a)).toBe("ROW3_COL4");
        expect(Index2dString.fromString("ROW3_COL4")).toEqual(a);
    });
});
