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

describe("TrackedPatternUtils.computeTrailShare", () => {
    it("holds the whole level through the delay, then fades", () => {
        const opts = { fadeDurationMs: 400, fadeDelayMs: 300 };

        expect(TrackedPatternUtils.computeTrailShare(0, opts)).toBe(1);
        expect(TrackedPatternUtils.computeTrailShare(300, opts)).toBe(1);
        expect(TrackedPatternUtils.computeTrailShare(500, opts)).toBeLessThan(1);
        expect(TrackedPatternUtils.computeTrailShare(700, opts)).toBe(0);
    });

    it("fades straight away with no delay, which is the old behavior", () => {
        expect(TrackedPatternUtils.computeTrailShare(1, { fadeDurationMs: 400, fadeDelayMs: 0 })).toBeLessThan(1);
    });

    it("drops at once when the hold ends and there is no fade", () => {
        const opts = { fadeDurationMs: 0, fadeDelayMs: 300 };

        expect(TrackedPatternUtils.computeTrailShare(300, opts)).toBe(1);
        expect(TrackedPatternUtils.computeTrailShare(301, opts)).toBe(0);
    });
});

describe("TrackedPatternUtils.createTrail", () => {
    const opts = { fadeDurationMs: 400, fadeDelayMs: 300, restLevel: 0.1 };

    it("keeps a cell at the level the pointer left it for the delay", () => {
        const trail = TrackedPatternUtils.createTrail();

        trail.computeLevel("a", 0.8, 0, opts);

        expect(trail.computeLevel("a", 0.1, 250, opts)).toBe(0.8);
        expect(trail.computeLevel("a", 0.1, 500, opts)).toBeLessThan(0.8);
        expect(trail.computeLevel("a", 0.1, 800, opts)).toBe(0.1);
    });

    it("warms a held cell at once when the pointer comes back brighter", () => {
        const trail = TrackedPatternUtils.createTrail();

        trail.computeLevel("a", 0.5, 0, opts);

        expect(trail.computeLevel("a", 0.9, 100, opts)).toBe(0.9);
    });

    it("counts the hold and the fade together for the clock", () => {
        expect(TrackedPatternUtils.getTrailSpanMs(opts)).toBe(700);
        expect(TrackedPatternUtils.getHasTrail({ fadeDurationMs: 0, fadeDelayMs: 0 })).toBe(false);
        expect(TrackedPatternUtils.getHasTrail({ fadeDurationMs: 0, fadeDelayMs: 200 })).toBe(true);
    });
});
