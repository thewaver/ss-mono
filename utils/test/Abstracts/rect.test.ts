import { describe, expect, it } from "vitest";

import { Rect, RectString, RectUtils } from "../../src/Abstracts/rect.js";

describe("Rect", () => {
    it("re-exports the shared four-number arithmetic", () => {
        const a = { x: 1, y: 2, width: 3, height: 4 };

        expect(Rect.add(a, a)).toEqual({ x: 2, y: 4, width: 6, height: 8 });
        expect(Rect.sub(a, a)).toEqual({ x: 0, y: 0, width: 0, height: 0 });
        expect(Rect.spread(5)).toEqual({ x: 5, y: 5, width: 5, height: 5 });
        expect(Rect.isSame(a, { ...a })).toBe(true);
    });

    it("round-trips through a string key", () => {
        const rect = { x: 0, y: 0, width: 10, height: 20 };

        expect(Rect.toString(rect)).toBe("X0_Y0_WIDTH10_HEIGHT20");
        expect(RectString.fromString("X0_Y0_WIDTH10_HEIGHT20")).toEqual(rect);
    });
});

describe("RectUtils.fit", () => {
    it("scales to fit and centers the leftover room", () => {
        expect(RectUtils.fit({ width: 100, height: 50 }, { width: 200, height: 200 })).toEqual({
            x: 0,
            y: 50,
            width: 200,
            height: 100,
            scale: 2,
        });
    });

    it("scales down when the box is too big", () => {
        expect(RectUtils.fit({ width: 200, height: 200 }, { width: 100, height: 100 })).toEqual({
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            scale: 0.5,
        });
    });

    it("centers horizontally when height is the limiting side", () => {
        expect(RectUtils.fit({ width: 50, height: 100 }, { width: 200, height: 200 })).toEqual({
            x: 50,
            y: 0,
            width: 100,
            height: 200,
            scale: 2,
        });
    });

    it("gives Infinity for a box with no area", () => {
        expect(RectUtils.fit({ width: 0, height: 0 }, { width: 100, height: 100 }).scale).toBe(Infinity);
    });
});

describe("RectUtils.getNormalizedBounds", () => {
    it("sorts corners into low and high edges", () => {
        expect(RectUtils.getNormalizedBounds({ x: 10, y: 10 }, { x: 0, y: 20 })).toEqual({
            minX: 0,
            maxX: 10,
            minY: 10,
            maxY: 20,
        });
    });

    it("gives the same answer whichever way round the corners come", () => {
        const a = { x: 3, y: 7 };
        const b = { x: 11, y: 2 };

        expect(RectUtils.getNormalizedBounds(a, b)).toEqual(RectUtils.getNormalizedBounds(b, a));
    });
});

describe("RectUtils.isPointInsideRect", () => {
    const rect = { x: 0, y: 0, width: 10, height: 10 };

    it("finds points within the rectangle", () => {
        expect(RectUtils.isPointInsideRect({ x: 5, y: 5 }, rect)).toBe(true);
    });

    it("counts points exactly on an edge as inside", () => {
        expect(RectUtils.isPointInsideRect({ x: 0, y: 0 }, rect)).toBe(true);
        expect(RectUtils.isPointInsideRect({ x: 10, y: 10 }, rect)).toBe(true);
        expect(RectUtils.isPointInsideRect({ x: 10, y: 5 }, rect)).toBe(true);
    });

    it("rejects points outside", () => {
        expect(RectUtils.isPointInsideRect({ x: -1, y: 5 }, rect)).toBe(false);
        expect(RectUtils.isPointInsideRect({ x: 5, y: 11 }, rect)).toBe(false);
    });
});

describe("RectUtils.hasAreaOverlap", () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };

    it("finds a genuine overlap", () => {
        expect(RectUtils.hasAreaOverlap(a, { x: 5, y: 5, width: 10, height: 10 })).toBe(true);
    });

    it("counts a shared edge as overlapping", () => {
        expect(RectUtils.hasAreaOverlap(a, { x: 10, y: 0, width: 5, height: 5 })).toBe(true);
    });

    it("rejects rectangles that are fully apart", () => {
        expect(RectUtils.hasAreaOverlap(a, { x: 20, y: 20, width: 5, height: 5 })).toBe(false);
    });

    it("is false if either rectangle is missing", () => {
        expect(RectUtils.hasAreaOverlap(undefined, a)).toBe(false);
        expect(RectUtils.hasAreaOverlap(a, undefined)).toBe(false);
    });
});

describe("RectUtils.hasAnyCornerInside", () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };

    it("finds a corner sitting inside the other rectangle", () => {
        expect(RectUtils.hasAnyCornerInside(a, { x: 5, y: 5, width: 10, height: 10 })).toBe(true);
    });

    it("works whichever rectangle contains the other", () => {
        expect(RectUtils.hasAnyCornerInside(a, { x: 2, y: 2, width: 2, height: 2 })).toBe(true);
        expect(RectUtils.hasAnyCornerInside({ x: 2, y: 2, width: 2, height: 2 }, a)).toBe(true);
    });

    it("is stricter than hasAreaOverlap for a plus shape", () => {
        // Two bars crossing: they share area, but no corner of either lands in the other.
        const horizontal = { x: 0, y: 4, width: 12, height: 4 };
        const vertical = { x: 4, y: 0, width: 4, height: 12 };

        expect(RectUtils.hasAreaOverlap(horizontal, vertical)).toBe(true);
        expect(RectUtils.hasAnyCornerInside(horizontal, vertical)).toBe(false);
    });

    it("is false if either rectangle is missing", () => {
        expect(RectUtils.hasAnyCornerInside(undefined, a)).toBe(false);
        expect(RectUtils.hasAnyCornerInside(a, undefined)).toBe(false);
    });
});

describe("RectUtils.getEdgePointTowards", () => {
    // A 100x60 box centered on the origin: it reaches 50 sideways and 30 up and down.
    const rect = { x: -50, y: -30, width: 100, height: 60 };

    it("leaves through the side the point lies towards", () => {
        expect(RectUtils.getEdgePointTowards(rect, { x: 500, y: 0 })).toEqual({ x: 50, y: 0 });
        expect(RectUtils.getEdgePointTowards(rect, { x: -500, y: 0 })).toEqual({ x: -50, y: 0 });
        expect(RectUtils.getEdgePointTowards(rect, { x: 0, y: 500 })).toEqual({ x: 0, y: 30 });
        expect(RectUtils.getEdgePointTowards(rect, { x: 0, y: -500 })).toEqual({ x: 0, y: -30 });
    });

    it("lands on the corner when the point lies along the diagonal", () => {
        expect(RectUtils.getEdgePointTowards(rect, { x: 100, y: 60 })).toEqual({ x: 50, y: 30 });
    });

    it("gives the same crossing wherever along the ray the point sits", () => {
        const near = RectUtils.getEdgePointTowards(rect, { x: 10, y: 4 });
        const far = RectUtils.getEdgePointTowards(rect, { x: 1000, y: 400 });

        expect(near).toEqual(far);
    });

    it("reports the reach in that direction, which a tall box and a wide one disagree about", () => {
        const wide = { x: -50, y: -10, width: 100, height: 20 };
        const tall = { x: -10, y: -50, width: 20, height: 100 };
        const sideways = { x: 1, y: 0 };

        expect(RectUtils.getEdgePointTowards(wide, sideways)).toEqual({ x: 50, y: 0 });
        expect(RectUtils.getEdgePointTowards(tall, sideways)).toEqual({ x: 10, y: 0 });
    });

    it("keeps the rectangle's own position out of the direction", () => {
        const offset = { x: 100, y: 100, width: 100, height: 60 };

        expect(RectUtils.getEdgePointTowards(offset, { x: 150, y: 1000 })).toEqual({ x: 150, y: 160 });
    });

    it("has no direction to leave in at the center, so it reports the right-hand edge", () => {
        expect(RectUtils.getEdgePointTowards(rect, { x: 0, y: 0 })).toEqual({ x: 50, y: 0 });
    });

    it("reports the center of a rectangle with no size", () => {
        expect(RectUtils.getEdgePointTowards({ x: 5, y: 5, width: 0, height: 0 }, { x: 50, y: 50 })).toEqual({
            x: 5,
            y: 5,
        });
    });
});

describe("RectUtils.getCenter", () => {
    it("finds the middle of a rectangle", () => {
        expect(RectUtils.getCenter({ x: 10, y: 20, width: 4, height: 6 })).toEqual({ x: 12, y: 23 });
    });
});

const FULL: Rect = { x: 0, y: 0, width: 400, height: 300 };

const area = (rect: Rect) => rect.width * rect.height;

const overlaps = (first: Rect, second: Rect) =>
    first.x < second.x + second.width &&
    second.x < first.x + first.width &&
    first.y < second.y + second.height &&
    second.y < first.y + first.height;

describe("RectUtils.bisectByWeight", () => {
    const WEIGHTS = [5, 3, 2, 1, 1];

    it("covers the frame exactly, with every part in proportion to its weight and none overlapping", () => {
        const rects = RectUtils.bisectByWeight(WEIGHTS, FULL);
        const total = WEIGHTS.reduce((sum, weight) => sum + weight, 0);

        rects.forEach((rect, index) => {
            expect(area(rect), `part ${index} takes its share of the area`).toBeCloseTo(
                (area(FULL) * WEIGHTS[index]) / total,
                6,
            );

            rects.slice(index + 1).forEach((other) => expect(overlaps(rect, other)).toBe(false));
        });
    });

    it("cuts across the longer side first, so a wide frame is split into a left and a right", () => {
        const [first, second] = RectUtils.bisectByWeight([1, 1], FULL);

        expect(first).toEqual({ x: 0, y: 0, width: 200, height: 300 });
        expect(second).toEqual({ x: 200, y: 0, width: 200, height: 300 });
    });

    it("gives a single weight the whole frame and no weights nothing", () => {
        expect(RectUtils.bisectByWeight([7], FULL)).toEqual([FULL]);
        expect(RectUtils.bisectByWeight([], FULL)).toEqual([]);
    });
});

describe("RectUtils.project", () => {
    const TILE: Rect = { x: 100, y: 50, width: 200, height: 150 };

    it("shrinks the full box into a tile and blows the tile back up to the full box", () => {
        expect(RectUtils.project(FULL, FULL, TILE)).toEqual(TILE);
        expect(RectUtils.project(TILE, TILE, FULL)).toEqual(FULL);
    });

    it("carries a rectangle there and back to where it started", () => {
        const rect: Rect = { x: 40, y: 30, width: 80, height: 60 };
        const there = RectUtils.project(rect, FULL, TILE);

        expect(RectUtils.project(there, TILE, FULL)).toEqual(rect);
    });

    it("answers the target itself when the source has no area", () => {
        expect(RectUtils.project(TILE, { x: 0, y: 0, width: 0, height: 10 }, FULL)).toEqual(FULL);
    });
});
