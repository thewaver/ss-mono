import { describe, expect, it } from "vitest";

import type { Count2d } from "@thewaver/ss-utils";

import { CellAnimationOrigins } from "./CellAnimationOrigins.const";

const ODD_GRID: Count2d = { colCount: 7, rowCount: 7 };
const EVEN_COLUMN: Count2d = { colCount: 1, rowCount: 8 };

describe("CellAnimationOriginsConst", () => {
    it("puts each named origin on the cell its name promises", () => {
        expect(CellAnimationOrigins.computeOrigin("top_left", ODD_GRID)).toEqual({ col: 0, row: 0 });
        expect(CellAnimationOrigins.computeOrigin("bottom_right", ODD_GRID)).toEqual({ col: 6, row: 6 });
        expect(CellAnimationOrigins.computeOrigin("center", ODD_GRID)).toEqual({ col: 3, row: 3 });
        expect(CellAnimationOrigins.computeOrigin("top", ODD_GRID)).toEqual({ col: 3, row: 0 });
        expect(CellAnimationOrigins.computeOrigin("bottom", ODD_GRID)).toEqual({ col: 3, row: 6 });
        expect(CellAnimationOrigins.computeOrigin("left", ODD_GRID)).toEqual({ col: 0, row: 3 });
        expect(CellAnimationOrigins.computeOrigin("right", ODD_GRID)).toEqual({ col: 6, row: 3 });
    });

    it("lands a centered origin between cells on an even count, which is where the parity weights break", () => {
        expect(CellAnimationOrigins.computeOrigin("center", { colCount: 4, rowCount: 4 })).toEqual({
            col: 1.5,
            row: 1.5,
        });
        expect(CellAnimationOrigins.computeOrigin("center", EVEN_COLUMN)).toEqual({ col: 0, row: 3.5 });
    });
});
