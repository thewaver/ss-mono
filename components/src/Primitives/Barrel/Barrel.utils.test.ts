import { describe, expect, it } from "vitest";

import { BarrelUtils } from "./Barrel.utils";

const APOTHEM = 50;

describe("getFaceTurnTransform and getFaceOffsetTransform", () => {
    it("turns a row barrel about the upright axis and a column barrel about the horizontal one", () => {
        expect(BarrelUtils.getFaceTurnTransform("row", 0, 0, 4)).toBe("rotateY(0deg)");
        expect(BarrelUtils.getFaceTurnTransform("column", 0, 0, 4)).toBe("rotateX(0deg)");
    });

    it("spaces the faces a whole step apart, against the way the barrel turns", () => {
        expect(BarrelUtils.getFaceTurnTransform("row", 0, 1, 4)).toBe("rotateY(-90deg)");
        expect(BarrelUtils.getFaceTurnTransform("row", 0, 2, 4)).toBe("rotateY(-180deg)");
    });

    it("carries the barrel's own angle into every face", () => {
        expect(BarrelUtils.getFaceTurnTransform("row", 30, 1, 4)).toBe("rotateY(-120deg)");
    });

    it("moves a face out to the surface apart from the turn, so the distance never animates with it", () => {
        expect(BarrelUtils.getFaceOffsetTransform("row", "front", APOTHEM)).toBe("translateZ(50px)");
    });

    it("hangs a back face on the far side of the front it shares a slot with", () => {
        expect(BarrelUtils.getFaceOffsetTransform("row", "back", APOTHEM)).toBe("translateZ(50px) rotateY(180deg)");
        expect(BarrelUtils.getFaceOffsetTransform("column", "back", APOTHEM)).toBe("translateZ(50px) rotateX(180deg)");
    });
});

describe("getGirth", () => {
    it("takes exactly one face for a two-face barrel, which rests flat", () => {
        expect(BarrelUtils.getGirth(220, 2)).toBe(220);
    });

    it("takes more than one face from three faces up, which curve away on screen at rest", () => {
        expect(BarrelUtils.getGirth(220, 3)).toBeGreaterThan(220);
    });
});

describe("getHasBacks", () => {
    it("prints a reverse once a barrel has three faces", () => {
        expect(BarrelUtils.getHasBacks(3)).toBe(true);
    });

    it("does not, for two faces that are already back to back", () => {
        expect(BarrelUtils.getHasBacks(2)).toBe(false);
    });
});

describe("getRootSize", () => {
    it("reserves the girth along the way the barrel turns, and one face across it", () => {
        expect(BarrelUtils.getRootSize({ width: 100, height: 40 }, "row", 180)).toEqual({ width: 180, height: 40 });
        expect(BarrelUtils.getRootSize({ width: 100, height: 40 }, "column", 180)).toEqual({ width: 100, height: 180 });
    });
});
