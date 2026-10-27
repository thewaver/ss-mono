import { describe, expect, it } from "vitest";

import type { PaintedRegion } from "./PaintedArea.types";
import { PaintedAreaUtils } from "./PaintedArea.utils";

const SQUARE = { x: 0, y: 0, width: 100, height: 100 };

const region = (patch: Partial<PaintedRegion> = {}): PaintedRegion => ({
    rect: SQUARE,
    radii: [0, 0, 0, 0],
    color: "red",
    ...patch,
});

describe("getIsColorTransparent", () => {
    it("reads the forms a computed style gives for no paint", () => {
        expect(PaintedAreaUtils.getIsColorTransparent("transparent")).toBe(true);
        expect(PaintedAreaUtils.getIsColorTransparent("rgba(0, 0, 0, 0)")).toBe(true);
        expect(PaintedAreaUtils.getIsColorTransparent("rgb(10 20 30 / 0)")).toBe(true);
        expect(PaintedAreaUtils.getIsColorTransparent("rgb(10 20 30 / 0%)")).toBe(true);
        expect(PaintedAreaUtils.getIsColorTransparent("oklch(0.5 0.1 200 / 0)")).toBe(true);
    });

    it("counts any other alpha as paint", () => {
        expect(PaintedAreaUtils.getIsColorTransparent("rgb(10, 20, 30)")).toBe(false);
        expect(PaintedAreaUtils.getIsColorTransparent("rgba(10, 20, 30, 0.01)")).toBe(false);
        expect(PaintedAreaUtils.getIsColorTransparent("rgb(10 20 30 / 50%)")).toBe(false);
    });
});

describe("parseCornerRadius", () => {
    it("reads pixels, takes a percentage of the side, and reads only the first of two values", () => {
        expect(PaintedAreaUtils.parseCornerRadius("12px", 200)).toBe(12);
        expect(PaintedAreaUtils.parseCornerRadius("50%", 200)).toBe(100);
        expect(PaintedAreaUtils.parseCornerRadius("12px 8px", 200)).toBe(12);
    });

    it("answers nothing for a value that is not a length", () => {
        expect(PaintedAreaUtils.parseCornerRadius("", 200)).toBe(0);
        expect(PaintedAreaUtils.parseCornerRadius("auto", 200)).toBe(0);
    });
});

describe("clampCornerRadii", () => {
    it("leaves radii that fit alone", () => {
        expect(PaintedAreaUtils.clampCornerRadii([10, 10, 10, 10], { width: 100, height: 100 })).toEqual([
            10, 10, 10, 10,
        ]);
    });

    it("scales every corner down together when the tightest side cannot hold its two", () => {
        expect(PaintedAreaUtils.clampCornerRadii([100, 100, 100, 100], { width: 100, height: 40 })).toEqual([
            20, 20, 20, 20,
        ]);
    });
});

describe("getIsPointInRoundedRect", () => {
    it("counts a point on the box and not one outside it", () => {
        expect(PaintedAreaUtils.getIsPointInRoundedRect(SQUARE, [0, 0, 0, 0], { x: 0, y: 0 })).toBe(true);
        expect(PaintedAreaUtils.getIsPointInRoundedRect(SQUARE, [0, 0, 0, 0], { x: 100.5, y: 50 })).toBe(false);
    });

    it("leaves out the corner a radius cuts away, and keeps the rest of the box", () => {
        const radii: [number, number, number, number] = [30, 30, 30, 30];

        expect(PaintedAreaUtils.getIsPointInRoundedRect(SQUARE, radii, { x: 1, y: 1 })).toBe(false);
        expect(PaintedAreaUtils.getIsPointInRoundedRect(SQUARE, radii, { x: 99, y: 99 })).toBe(false);
        expect(PaintedAreaUtils.getIsPointInRoundedRect(SQUARE, radii, { x: 99, y: 1 })).toBe(false);
        expect(PaintedAreaUtils.getIsPointInRoundedRect(SQUARE, radii, { x: 1, y: 99 })).toBe(false);
        expect(PaintedAreaUtils.getIsPointInRoundedRect(SQUARE, radii, { x: 50, y: 1 })).toBe(true);
        expect(PaintedAreaUtils.getIsPointInRoundedRect(SQUARE, radii, { x: 10, y: 10 })).toBe(true);
    });

    it("makes a pill of a box rounded by half its height", () => {
        const pill = { x: 0, y: 0, width: 100, height: 40 };
        const radii: [number, number, number, number] = [20, 20, 20, 20];

        expect(PaintedAreaUtils.getIsPointInRoundedRect(pill, radii, { x: 2, y: 2 })).toBe(false);
        expect(PaintedAreaUtils.getIsPointInRoundedRect(pill, radii, { x: 50, y: 20 })).toBe(true);
    });
});

describe("findRegionAt", () => {
    it("answers the later region where two overlap", () => {
        const under = region({ color: "red" });
        const over = region({ color: "blue", rect: { x: 50, y: 50, width: 50, height: 50 } });

        expect(PaintedAreaUtils.findRegionAt([under, over], { x: 75, y: 75 })?.color).toBe("blue");
        expect(PaintedAreaUtils.findRegionAt([under, over], { x: 10, y: 10 })?.color).toBe("red");
    });

    it("answers nothing for a point no region paints", () => {
        expect(PaintedAreaUtils.findRegionAt([region()], { x: 500, y: 500 })).toBeUndefined();
        expect(PaintedAreaUtils.findRegionAt([], { x: 0, y: 0 })).toBeUndefined();
    });

    it("asks a shape that overstates its box, and not the box alone", () => {
        const shape = region({ getIsInside: (point) => point.x < 50 });

        expect(PaintedAreaUtils.findRegionAt([shape], { x: 25, y: 50 })).toBe(shape);
        expect(PaintedAreaUtils.findRegionAt([shape], { x: 75, y: 50 })).toBeUndefined();
    });
});

describe("computeSamples", () => {
    it("finds painted points across a box and gives each its color", () => {
        const samples = PaintedAreaUtils.computeSamples([region({ color: "green" })], SQUARE);

        expect(samples).toHaveLength(9);
        expect(samples.every((sample) => sample.color === "green")).toBe(true);
    });

    it("finds a thin line that a single point at the box's center would miss", () => {
        const line = region({ rect: { x: 0, y: 5, width: 100, height: 10 } });
        const samples = PaintedAreaUtils.computeSamples([line], { x: 0, y: 0, width: 100, height: 60 });

        expect(samples.length).toBeGreaterThan(0);
        expect(samples.every((sample) => sample.pos.y >= 5 && sample.pos.y <= 15)).toBe(true);
    });

    it("answers nothing for a box nothing paints", () => {
        expect(PaintedAreaUtils.computeSamples([region()], { x: 300, y: 300, width: 50, height: 50 })).toEqual([]);
    });
});

describe("a picture's region", () => {
    const picture = region({
        color: "gray",
        getColorAt: (point) => (point.x < 50 ? "red" : undefined),
    });

    it("paints only the points its picture has color at", () => {
        expect(PaintedAreaUtils.findRegionAt([picture], { x: 25, y: 50 })).toBe(picture);
        expect(PaintedAreaUtils.findRegionAt([picture], { x: 75, y: 50 })).toBeUndefined();
    });

    it("lets the region under it show where the picture is transparent", () => {
        const under = region({ color: "blue" });

        expect(PaintedAreaUtils.findRegionAt([under, picture], { x: 75, y: 50 })).toBe(under);
        expect(PaintedAreaUtils.findRegionAt([under, picture], { x: 25, y: 50 })).toBe(picture);
    });

    it("gives the color of the point, and the region's own color when it has none", () => {
        expect(PaintedAreaUtils.getRegionColor(picture, { x: 25, y: 50 })).toBe("red");
        expect(PaintedAreaUtils.getRegionColor(region({ color: "green" }), { x: 25, y: 50 })).toBe("green");
    });

    it("hands each sample the color of the picture where it falls", () => {
        const samples = PaintedAreaUtils.computeSamples([picture], SQUARE);

        expect(samples.length).toBeGreaterThan(0);
        expect(samples.every((sample) => sample.pos.x < 50 && sample.color === "red")).toBe(true);
    });
});
