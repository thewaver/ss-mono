import { describe, expect, it } from "vitest";

import { SVGPatternLayouts } from "../SVGPatternLayouts.const";
import type { SVGPatternKind } from "../SVGPatternLayouts.types";
import { TrackedPatternUtils } from "./TrackedPattern.utils";

const CELL = { width: 30, height: 30 };
const AREA = { width: 400, height: 250 };
const KINDS = Object.keys(SVGPatternLayouts.ALL) as SVGPatternKind[];
const OPTS = { isTiled: false, reach: 3, restLevel: 0.2 };

describe("TrackedPatternUtils.computeCoveringCellCount", () => {
    it.each(KINDS)("gives %s a tile that reaches across the whole area", (kind) => {
        const layout = SVGPatternLayouts.ALL[kind];
        const request = TrackedPatternUtils.computeCoveringCellCount(kind, CELL, AREA);
        const tile = layout.computePatternSize(layout.computeCellCount(request), CELL);

        expect(tile.width).toBeGreaterThanOrEqual(AREA.width);
        expect(tile.height).toBeGreaterThanOrEqual(AREA.height);
    });

    it("stops at the first count that covers, rather than overshooting", () => {
        expect(TrackedPatternUtils.computeCoveringCellCount("grid", CELL, AREA)).toEqual({ rows: 9, cols: 14 });
    });

    it("still answers with a cell for an area that has not been measured yet", () => {
        expect(TrackedPatternUtils.computeCoveringCellCount("grid", CELL, { width: 0, height: 0 })).toEqual({
            rows: 1,
            cols: 1,
        });
    });
});

describe("TrackedPatternUtils.computeLevel", () => {
    const count = { rows: 8, cols: 8 };

    it("rests with no pointer", () => {
        expect(TrackedPatternUtils.computeLevel("grid", { row: 2, col: 2 }, count, CELL, undefined, OPTS)).toBe(0.2);
    });

    it("peaks with the pointer on the cell's center and rests out of reach", () => {
        const center = { x: 75, y: 75 };

        expect(TrackedPatternUtils.computeLevel("grid", { row: 2, col: 2 }, count, CELL, center, OPTS)).toBe(1);
        expect(TrackedPatternUtils.computeLevel("grid", { row: 2, col: 6 }, count, CELL, center, OPTS)).toBe(0.2);
    });

    it("falls off with distance in between", () => {
        const pointer = { x: 75, y: 75 };
        const near = TrackedPatternUtils.computeLevel("grid", { row: 2, col: 3 }, count, CELL, pointer, OPTS);
        const far = TrackedPatternUtils.computeLevel("grid", { row: 2, col: 4 }, count, CELL, pointer, OPTS);

        expect(near).toBeLessThan(1);
        expect(far).toBeLessThan(near);
        expect(far).toBeGreaterThan(0.2);
    });

    it("on a repeating tile, measures to the nearest copy of the pointer", () => {
        const pointer = { x: 15, y: 15 };
        const lastCol = { row: 0, col: 7 };
        const tiled = { ...OPTS, isTiled: true };

        expect(
            TrackedPatternUtils.computeLevel("grid", lastCol, count, CELL, pointer, OPTS),
            "not when it covers",
        ).toBe(0.2);
        expect(
            TrackedPatternUtils.computeLevel("grid", lastCol, count, CELL, pointer, tiled),
            "one cell away across the seam",
        ).toBeGreaterThan(0.2);
    });
});
