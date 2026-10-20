import { describe, expect, it } from "vitest";

import { QuadUtils } from "@thewaver/ss-utils";

import { QuadWarpUtils } from "./QuadWarp.utils";

describe("clampMove", () => {
    const RESTING = QuadWarpUtils.RESTING_CORNERS;

    it("goes where it was asked when nothing is in the way", () => {
        expect(QuadWarpUtils.clampMove(RESTING, "top_left", { x: 0.2, y: 0.1 }, 0.5)).toEqual({ x: 0.2, y: 0.1 });
    });

    it("stays within the reach past each edge", () => {
        expect(QuadWarpUtils.clampMove(RESTING, "top_left", { x: -2, y: -0.3 }, 0.5)).toEqual({ x: -0.5, y: -0.3 });
    });

    it("stops short of folding the shape, and the shape it stops at can still be drawn", () => {
        const moved = QuadWarpUtils.clampMove(RESTING, "top_left", { x: 1.4, y: 1.4 }, 0.5);

        expect(moved.x).toBeGreaterThan(0);
        expect(moved.x).toBeLessThan(0.5);
        expect(moved.x).toBeCloseTo(moved.y);
        expect(QuadUtils.getIsConvex({ ...RESTING, top_left: moved })).toBe(true);
    });

    it("lets an already folded shape be unfolded, and never folds it further", () => {
        const folded = { ...RESTING, top_left: { x: 0.8, y: 0.8 } };

        expect(QuadWarpUtils.clampMove(folded, "top_left", { x: 0.9, y: 0.9 }, 0.5)).toEqual({ x: 0.8, y: 0.8 });
        expect(QuadWarpUtils.clampMove(folded, "top_left", { x: 0, y: 0 }, 0.5)).toEqual({ x: 0, y: 0 });
    });
});

describe("toBoxRatio", () => {
    it("measures a point across the box on each axis", () => {
        expect(QuadWarpUtils.toBoxRatio({ x: 150, y: 75 }, { x: 100, y: 50, width: 200, height: 100 })).toEqual({
            x: 0.25,
            y: 0.25,
        });
    });
});
