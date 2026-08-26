import { describe, expect, it } from "vitest";

import { CuboidUtils } from "./Cuboid.utils";

const SIZE = { width: 200, height: 300, depth: 100 };

describe("getFaceSize", () => {
    it("gives the upright faces the box's own width and height", () => {
        expect(CuboidUtils.getFaceSize("front", SIZE)).toEqual({ width: 200, height: 300 });
        expect(CuboidUtils.getFaceSize("back", SIZE)).toEqual({ width: 200, height: 300 });
    });

    it("gives the sides the depth as their width, since that is what they span", () => {
        expect(CuboidUtils.getFaceSize("left", SIZE)).toEqual({ width: 100, height: 300 });
        expect(CuboidUtils.getFaceSize("right", SIZE)).toEqual({ width: 100, height: 300 });
    });

    it("gives the lid and the floor the depth as their height", () => {
        expect(CuboidUtils.getFaceSize("top", SIZE)).toEqual({ width: 200, height: 100 });
        expect(CuboidUtils.getFaceSize("bottom", SIZE)).toEqual({ width: 200, height: 100 });
    });
});

describe("getFaceTransform", () => {
    it("pushes each face out to half the extent it faces along", () => {
        expect(CuboidUtils.getFaceTransform("front", SIZE)).toBe("translateZ(50px)");
        expect(CuboidUtils.getFaceTransform("right", SIZE)).toBe("rotateY(90deg) translateZ(100px)");
        expect(CuboidUtils.getFaceTransform("top", SIZE)).toBe("rotateX(90deg) translateZ(150px)");
    });

    it("turns the opposite faces the other way, so both look outwards", () => {
        expect(CuboidUtils.getFaceTransform("back", SIZE)).toBe("rotateY(180deg) translateZ(50px)");
        expect(CuboidUtils.getFaceTransform("left", SIZE)).toBe("rotateY(-90deg) translateZ(100px)");
        expect(CuboidUtils.getFaceTransform("bottom", SIZE)).toBe("rotateX(-90deg) translateZ(150px)");
    });
});

describe("getFacing", () => {
    it("walks the four upright faces as it turns across", () => {
        expect(CuboidUtils.getFacing(0, 0)).toBe("front");
        expect(CuboidUtils.getFacing(1, 0)).toBe("right");
        expect(CuboidUtils.getFacing(2, 0)).toBe("back");
        expect(CuboidUtils.getFacing(3, 0)).toBe("left");
    });

    it("comes round rather than running out, in both directions", () => {
        expect(CuboidUtils.getFacing(4, 0)).toBe("front");
        expect(CuboidUtils.getFacing(-1, 0)).toBe("left");
    });

    it("brings the lid up and the floor down", () => {
        expect(CuboidUtils.getFacing(0, 1)).toBe("top");
        expect(CuboidUtils.getFacing(0, -1)).toBe("bottom");
    });

    it("shows the same face whichever way it was turned across, once it is on the lid", () => {
        expect(CuboidUtils.getFacing(2, 1)).toBe("top");
        expect(CuboidUtils.getFacing(3, 1)).toBe("top");
    });

    it("carries on over the top to the far side, upside down", () => {
        expect(CuboidUtils.getFacing(0, 2)).toBe("back");
        expect(CuboidUtils.getFacing(1, 2)).toBe("left");
        expect(CuboidUtils.getFacing(2, 2)).toBe("front");
    });
});

describe("getReservedSize", () => {
    it("reserves room for the box at any angle, not only the one it rests at", () => {
        const reserved = CuboidUtils.getReservedSize(SIZE);

        expect(
            reserved.width,
            "wider than the face it rests on, which is the least it could get away with",
        ).toBeGreaterThan(SIZE.width);
        expect(
            reserved.width,
            "and taller than that face too, since a turn can bring the height across",
        ).toBeGreaterThan(SIZE.height);
        expect(reserved.height, "the room is square, because either turn can present either extent").toBe(
            reserved.width,
        );
    });

    it("grows with the box rather than being a constant", () => {
        expect(CuboidUtils.getReservedSize({ width: 400, height: 300, depth: 100 }).width).toBeGreaterThan(
            CuboidUtils.getReservedSize(SIZE).width,
        );
    });
});
