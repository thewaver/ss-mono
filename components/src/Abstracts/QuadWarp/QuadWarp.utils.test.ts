import { describe, expect, it } from "vitest";

import type { QuadWarpCorners } from "./QuadWarp.types";
import { QuadWarpUtils } from "./QuadWarp.utils";

const SIZE = { width: 200, height: 100 };

const TRAPEZOID: QuadWarpCorners = {
    top_left: { x: 60, y: 10 },
    top_right: { x: 140, y: 10 },
    bottom_right: { x: 200, y: 100 },
    bottom_left: { x: 0, y: 100 },
};

const FOLDED: QuadWarpCorners = {
    top_left: { x: 0, y: 0 },
    top_right: { x: 200, y: 100 },
    bottom_right: { x: 200, y: 0 },
    bottom_left: { x: 0, y: 100 },
};

const parseMatrix = (transform: string) => transform.slice("matrix3d(".length, -1).split(",").map(Number);

const applyMatrix = (matrix: number[], x: number, y: number) => {
    const w = matrix[3] * x + matrix[7] * y + matrix[15];

    return { x: (matrix[0] * x + matrix[4] * y + matrix[12]) / w, y: (matrix[1] * x + matrix[5] * y + matrix[13]) / w };
};

describe("toTransform", () => {
    it("puts each of the box's own corners where it was asked to go", () => {
        const matrix = parseMatrix(QuadWarpUtils.toTransform(SIZE, TRAPEZOID)!);

        const landed = {
            top_left: applyMatrix(matrix, 0, 0),
            top_right: applyMatrix(matrix, SIZE.width, 0),
            bottom_right: applyMatrix(matrix, SIZE.width, SIZE.height),
            bottom_left: applyMatrix(matrix, 0, SIZE.height),
        };

        for (const corner of QuadWarpUtils.CORNERS) {
            expect(landed[corner].x).toBeCloseTo(TRAPEZOID[corner].x);
            expect(landed[corner].y).toBeCloseTo(TRAPEZOID[corner].y);
        }
    });

    it("leaves a box pinned to its own corners where it is", () => {
        const matrix = parseMatrix(
            QuadWarpUtils.toTransform(SIZE, QuadWarpUtils.toPixels(QuadWarpUtils.RESTING_CORNERS, SIZE))!,
        );

        expect(applyMatrix(matrix, 37, 61).x).toBeCloseTo(37);
        expect(applyMatrix(matrix, 37, 61).y).toBeCloseTo(61);
    });

    it("draws nothing for a folded shape or a box with no size", () => {
        expect(QuadWarpUtils.toTransform(SIZE, FOLDED)).toBeUndefined();
        expect(QuadWarpUtils.toTransform({ width: 0, height: 100 }, TRAPEZOID)).toBeUndefined();
    });
});

describe("mapPoint", () => {
    it("agrees with the transform about where a point inside lands", () => {
        const matrix = parseMatrix(QuadWarpUtils.toTransform(SIZE, TRAPEZOID)!);
        const mapped = QuadWarpUtils.mapPoint(SIZE, TRAPEZOID, { x: 50, y: 25 })!;

        expect(mapped.x).toBeCloseTo(applyMatrix(matrix, 50, 25).x);
        expect(mapped.y).toBeCloseTo(applyMatrix(matrix, 50, 25).y);
    });

    it("keeps the middle of a symmetric shape on its line of symmetry", () => {
        expect(QuadWarpUtils.mapPoint(SIZE, TRAPEZOID, { x: 100, y: 50 })!.x).toBeCloseTo(100);
    });
});

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
        expect(QuadWarpUtils.getIsConvex({ ...RESTING, top_left: moved })).toBe(true);
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

describe("project", () => {
    it("draws a point level with the screen where it is, and a further one nearer the middle", () => {
        expect(QuadWarpUtils.project({ x: 100, y: 50, z: 0 }, 900)).toEqual({ x: 100, y: 50 });
        expect(QuadWarpUtils.project({ x: 100, y: 50, z: -900 }, 900)).toEqual({ x: 50, y: 25 });
    });

    it("draws nothing level with the viewer or behind", () => {
        expect(QuadWarpUtils.project({ x: 1, y: 1, z: 900 }, 900)).toBeUndefined();
        expect(QuadWarpUtils.project({ x: 1, y: 1, z: 1000 }, 900)).toBeUndefined();
    });
});
