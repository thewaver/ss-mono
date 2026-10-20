import { describe, expect, it } from "vitest";

import { type Quad, QuadUtils } from "../../src/Abstracts/quad.js";

const SIZE = { width: 200, height: 100 };

const TRAPEZOID: Quad = {
    top_left: { x: 60, y: 10 },
    top_right: { x: 140, y: 10 },
    bottom_right: { x: 200, y: 100 },
    bottom_left: { x: 0, y: 100 },
};

const RESTING: Quad = {
    top_left: { x: 0, y: 0 },
    top_right: { x: 1, y: 0 },
    bottom_right: { x: 1, y: 1 },
    bottom_left: { x: 0, y: 1 },
};

const FOLDED: Quad = {
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

describe("QuadUtils.toCss", () => {
    it("puts each of the box's own corners where it was asked to go", () => {
        const matrix = parseMatrix(QuadUtils.toCss(SIZE, TRAPEZOID)!);

        const landed = {
            top_left: applyMatrix(matrix, 0, 0),
            top_right: applyMatrix(matrix, SIZE.width, 0),
            bottom_right: applyMatrix(matrix, SIZE.width, SIZE.height),
            bottom_left: applyMatrix(matrix, 0, SIZE.height),
        };

        for (const corner of QuadUtils.CORNERS) {
            expect(landed[corner].x).toBeCloseTo(TRAPEZOID[corner].x);
            expect(landed[corner].y).toBeCloseTo(TRAPEZOID[corner].y);
        }
    });

    it("leaves a box pinned to its own corners where it is", () => {
        const matrix = parseMatrix(QuadUtils.toCss(SIZE, QuadUtils.scale(RESTING, SIZE))!);

        expect(applyMatrix(matrix, 37, 61).x).toBeCloseTo(37);
        expect(applyMatrix(matrix, 37, 61).y).toBeCloseTo(61);
    });

    it("draws nothing for a folded shape or a box with no size", () => {
        expect(QuadUtils.toCss(SIZE, FOLDED)).toBeUndefined();
        expect(QuadUtils.toCss({ width: 0, height: 100 }, TRAPEZOID)).toBeUndefined();
    });
});

describe("QuadUtils.mapPoint", () => {
    it("agrees with the transform about where a point inside lands", () => {
        const matrix = parseMatrix(QuadUtils.toCss(SIZE, TRAPEZOID)!);
        const mapped = QuadUtils.mapPoint(SIZE, TRAPEZOID, { x: 50, y: 25 })!;

        expect(mapped.x).toBeCloseTo(applyMatrix(matrix, 50, 25).x);
        expect(mapped.y).toBeCloseTo(applyMatrix(matrix, 50, 25).y);
    });

    it("keeps the middle of a symmetric shape on its line of symmetry", () => {
        expect(QuadUtils.mapPoint(SIZE, TRAPEZOID, { x: 100, y: 50 })!.x).toBeCloseTo(100);
    });
});

describe("QuadUtils.getNeighbor", () => {
    it("steps clockwise, and back the other way, wrapping round", () => {
        expect(QuadUtils.getNeighbor("top_left", 1)).toBe("top_right");
        expect(QuadUtils.getNeighbor("top_left", -1)).toBe("bottom_left");
        expect(QuadUtils.getNeighbor("bottom_left", 6)).toBe("top_right");
    });
});

describe("QuadUtils.getIsConvex", () => {
    it("takes a shape whose corners all turn the same way, and refuses one that crosses itself", () => {
        expect(QuadUtils.getIsConvex(TRAPEZOID)).toBe(true);
        expect(QuadUtils.getIsConvex(FOLDED)).toBe(false);
    });
});
