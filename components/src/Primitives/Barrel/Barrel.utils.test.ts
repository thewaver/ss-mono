import { describe, expect, it } from "vitest";

import { BarrelUtils } from "./Barrel.utils";

const APOTHEM = 50;

describe("getFaceTransform", () => {
    it("turns a row barrel about the upright axis and a column barrel about the horizontal one", () => {
        expect(BarrelUtils.getFaceTransform("row", "front", 0, 0, 4, APOTHEM)).toBe("rotateY(0deg) translateZ(50px)");
        expect(BarrelUtils.getFaceTransform("column", "front", 0, 0, 4, APOTHEM)).toBe(
            "rotateX(0deg) translateZ(50px)",
        );
    });

    it("spaces the faces a whole step apart, against the way the barrel turns", () => {
        expect(BarrelUtils.getFaceTransform("row", "front", 0, 1, 4, APOTHEM)).toContain("rotateY(-90deg)");
        expect(BarrelUtils.getFaceTransform("row", "front", 0, 2, 4, APOTHEM)).toContain("rotateY(-180deg)");
    });

    it("carries the barrel's own angle into every face", () => {
        expect(BarrelUtils.getFaceTransform("row", "front", 30, 1, 4, APOTHEM)).toContain("rotateY(-120deg)");
    });

    it("hangs a back face on the far side of the front it shares a slot with", () => {
        expect(BarrelUtils.getFaceTransform("row", "back", 0, 0, 4, APOTHEM)).toBe(
            "rotateY(0deg) translateZ(50px) rotateY(180deg)",
        );
        expect(BarrelUtils.getFaceTransform("column", "back", 0, 0, 4, APOTHEM)).toBe(
            "rotateX(0deg) translateZ(50px) rotateX(180deg)",
        );
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
