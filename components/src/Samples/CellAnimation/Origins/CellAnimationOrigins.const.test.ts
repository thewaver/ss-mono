import { describe, expect, it } from "vitest";

import type { Index2d } from "@thewaver/ss-utils";

import { CellAnimationOrigins } from "./CellAnimationOrigins.const";

const ODD_GRID: Index2d = { col: 7, row: 7 };
const EVEN_COLUMN: Index2d = { col: 1, row: 8 };

describe("CellAnimationOriginsConst", () => {
    it("puts each named origin on the cell its name promises", () => {
        expect(CellAnimationOrigins.computeOrigin("topLeft", ODD_GRID)).toEqual({ col: 0, row: 0 });
        expect(CellAnimationOrigins.computeOrigin("bottomRight", ODD_GRID)).toEqual({ col: 6, row: 6 });
        expect(CellAnimationOrigins.computeOrigin("center", ODD_GRID)).toEqual({ col: 3, row: 3 });
        expect(CellAnimationOrigins.computeOrigin("top", ODD_GRID)).toEqual({ col: 3, row: 0 });
        expect(CellAnimationOrigins.computeOrigin("bottom", ODD_GRID)).toEqual({ col: 3, row: 6 });
        expect(CellAnimationOrigins.computeOrigin("left", ODD_GRID)).toEqual({ col: 0, row: 3 });
        expect(CellAnimationOrigins.computeOrigin("right", ODD_GRID)).toEqual({ col: 6, row: 3 });
    });

    it("lands a centered origin between cells on an even count, which is where the parity weights break", () => {
        expect(CellAnimationOrigins.computeOrigin("center", { col: 4, row: 4 })).toEqual({ col: 1.5, row: 1.5 });
        expect(CellAnimationOrigins.computeOrigin("center", EVEN_COLUMN)).toEqual({ col: 0, row: 3.5 });
    });
});
