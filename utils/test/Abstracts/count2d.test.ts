import { describe, expect, it } from "vitest";

import { Count2d, Count2dString } from "../../src/Abstracts/count2d.js";

const a = { rowCount: 3, colCount: 4 };
const b = { rowCount: 1, colCount: 8 };

describe("Count2d", () => {
    it("does arithmetic under rowCount/colCount", () => {
        expect(Count2d.add(a, b)).toEqual({ rowCount: 4, colCount: 12 });
        expect(Count2d.sub(a, b)).toEqual({ rowCount: 2, colCount: -4 });
        expect(Count2d.mul(a, b)).toEqual({ rowCount: 3, colCount: 32 });
        expect(Count2d.div(a, b)).toEqual({ rowCount: 3, colCount: 0.5 });
    });

    it("takes the smaller or larger of each tally", () => {
        expect(Count2d.min(a, b)).toEqual({ rowCount: 1, colCount: 4 });
        expect(Count2d.max(a, b)).toEqual({ rowCount: 3, colCount: 8 });
        expect(Count2d.max(undefined, b)).toBeUndefined();
    });

    it("compares field by field", () => {
        expect(Count2d.isSame(a, { ...a })).toBe(true);
        expect(Count2d.isSame(a, b)).toBe(false);
    });

    it("round-trips through a string key", () => {
        expect(Count2d.toString(a)).toBe("ROWCOUNT3_COLCOUNT4");
        expect(Count2dString.fromString("ROWCOUNT3_COLCOUNT4")).toEqual(a);
    });
});
