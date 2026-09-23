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

describe("getFacingFromTurns", () => {
    it("walks the four upright faces as it turns across", () => {
        expect(CuboidUtils.getFacingFromTurns(0, 0)).toBe("front");
        expect(CuboidUtils.getFacingFromTurns(1, 0)).toBe("right");
        expect(CuboidUtils.getFacingFromTurns(2, 0)).toBe("back");
        expect(CuboidUtils.getFacingFromTurns(3, 0)).toBe("left");
    });

    it("comes round rather than running out, in both directions", () => {
        expect(CuboidUtils.getFacingFromTurns(4, 0)).toBe("front");
        expect(CuboidUtils.getFacingFromTurns(-1, 0)).toBe("left");
    });

    it("brings the lid up and the floor down", () => {
        expect(CuboidUtils.getFacingFromTurns(0, 1)).toBe("top");
        expect(CuboidUtils.getFacingFromTurns(0, -1)).toBe("bottom");
    });

    it("shows the same face whichever way it was turned across, once it is on the lid", () => {
        expect(CuboidUtils.getFacingFromTurns(2, 1)).toBe("top");
        expect(CuboidUtils.getFacingFromTurns(3, 1)).toBe("top");
    });

    it("carries on over the top to the far side, upside down", () => {
        expect(CuboidUtils.getFacingFromTurns(0, 2)).toBe("back");
        expect(CuboidUtils.getFacingFromTurns(1, 2)).toBe("left");
        expect(CuboidUtils.getFacingFromTurns(2, 2)).toBe("front");
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

const FRONT = CuboidUtils.getCountedOrientation(0, 0);
const ACROSS = { yaw: 1, pitch: 0 };
const UP = { yaw: 0, pitch: 1 };

describe("getCountedOrientation", () => {
    it("shows the same face the counts do, at every pose", () => {
        for (let yaw = -4; yaw <= 4; yaw++) {
            for (let pitch = -4; pitch <= 4; pitch++) {
                expect(CuboidUtils.getFacingFromOrientation(CuboidUtils.getCountedOrientation(yaw, pitch))).toBe(
                    CuboidUtils.getFacingFromTurns(yaw, pitch),
                );
            }
        }
    });
});

describe("standUpright", () => {
    it("leaves a face that already reads the right way up alone", () => {
        expect(CuboidUtils.standUpright(FRONT)).toEqual(FRONT);
        expect(CuboidUtils.standUpright(CuboidUtils.getCountedOrientation(0, 1))).toEqual(
            CuboidUtils.getCountedOrientation(0, 1),
        );
    });

    it("turns the far side the right way up once it has been tipped over the top, without changing which face shows", () => {
        const overTheTop = CuboidUtils.getCountedOrientation(0, 2);
        const righted = CuboidUtils.standUpright(overTheTop);

        expect(CuboidUtils.getFacingFromOrientation(righted)).toBe("back");
        expect(righted, "the back, read upright, is the pose of two turns across").toEqual(
            CuboidUtils.getCountedOrientation(2, 0),
        );
    });
});

describe("turnUpright", () => {
    it("brings the face on the right round, and the face above", () => {
        expect(CuboidUtils.getFacingFromOrientation(CuboidUtils.turnUpright(FRONT, ACROSS))).toBe("right");
        expect(CuboidUtils.getFacingFromOrientation(CuboidUtils.turnUpright(FRONT, UP))).toBe("top");
    });

    it("turns across the way it was pressed while upside down, which the counts as a pose do not", () => {
        const back = CuboidUtils.turnUpright(FRONT, { yaw: 0, pitch: 2 });

        expect(CuboidUtils.getFacingFromOrientation(back)).toBe("back");
        expect(
            CuboidUtils.getFacingFromOrientation(CuboidUtils.turnUpright(back, ACROSS)),
            "the face on the right of the back, as seen, is the left",
        ).toBe("left");
        expect(CuboidUtils.getFacingFromTurns(1, 2), "where the pose reading brings the other side").toBe("left");
    });

    it("turns across from the lid to another face, rather than spinning the lid in place", () => {
        const lid = CuboidUtils.turnUpright(FRONT, UP);

        expect(CuboidUtils.getFacingFromOrientation(CuboidUtils.turnUpright(lid, ACROSS))).toBe("right");
        expect(CuboidUtils.getFacingFromTurns(1, 1), "where the pose reading stays on the lid").toBe("top");
    });

    it("comes round after four presses the same way along the sides", () => {
        expect(CuboidUtils.turnUpright(FRONT, { yaw: 4, pitch: 0 })).toEqual(FRONT);
        expect(CuboidUtils.turnUpright(FRONT, { yaw: -3, pitch: 0 })).toEqual(CuboidUtils.turnUpright(FRONT, ACROSS));
    });

    it("gives the same answer for a long run as for walking it press by press", () => {
        const lid = CuboidUtils.turnUpright(FRONT, UP);
        let walked = lid;

        for (let press = 0; press < 23; press++) walked = CuboidUtils.turnUpright(walked, UP);

        expect(CuboidUtils.turnUpright(lid, { yaw: 0, pitch: 23 })).toEqual(walked);
    });
});

describe("getTurnsTo", () => {
    const fromPose = (yaw: number, pitch: number) => (turns: { yaw: number; pitch: number }) =>
        CuboidUtils.getFacingFromTurns(yaw + turns.yaw, pitch + turns.pitch);

    it("asks for nothing when the face already shows", () => {
        expect(CuboidUtils.getTurnsTo("front", fromPose(0, 0))).toEqual({ yaw: 0, pitch: 0 });
    });

    it("takes one turn to a neighbor", () => {
        expect(CuboidUtils.getTurnsTo("left", fromPose(0, 0))).toEqual({ yaw: -1, pitch: 0 });
        expect(CuboidUtils.getTurnsTo("bottom", fromPose(0, 0))).toEqual({ yaw: 0, pitch: -1 });
    });

    it("turns across rather than tipping when the two are as short", () => {
        expect(CuboidUtils.getTurnsTo("back", fromPose(0, 0))).toEqual({ yaw: 2, pitch: 0 });
    });

    it("finds a route from the lid, where turning across alone gets nowhere", () => {
        expect(CuboidUtils.getTurnsTo("right", fromPose(0, 1))).toEqual({ yaw: 1, pitch: -1 });
    });

    it("plans from a kept orientation just as well", () => {
        const lid = CuboidUtils.turnUpright(FRONT, UP);
        const turns = CuboidUtils.getTurnsTo("bottom", (t) =>
            CuboidUtils.getFacingFromOrientation(CuboidUtils.turnUpright(lid, t)),
        );

        expect(turns, "across to a side, then down, rather than tipping twice").toEqual({ yaw: 1, pitch: -1 });
    });
});

describe("readOrientation", () => {
    it("reads the rotation out of what the browser reports, ignoring the push back", () => {
        expect(
            CuboidUtils.readOrientation(
                "matrix3d(6.12323e-17, 0, 1, 0, 0, 1, 0, 0, -1, 0, 6.12323e-17, 0, 0, 0, -60, 1)",
            ),
        ).toEqual(CuboidUtils.getCountedOrientation(1, 0));
    });

    it("reads a flat matrix and no transform at all", () => {
        expect(CuboidUtils.readOrientation("none")).toEqual(FRONT);
        expect(CuboidUtils.readOrientation("matrix(1, 0, 0, 1, 0, 0)")).toEqual(FRONT);
    });

    it("gives up on anything else", () => {
        expect(CuboidUtils.readOrientation("rotate(4deg)")).toBeUndefined();
    });
});

describe("getArcBetween", () => {
    it("is nothing between an orientation and itself", () => {
        expect(CuboidUtils.getArcBetween(FRONT, FRONT)).toBeUndefined();
    });

    it("is a quarter turn about the screen's vertical axis for one press across", () => {
        const arc = CuboidUtils.getArcBetween(FRONT, CuboidUtils.turnUpright(FRONT, ACROSS), ACROSS)!;

        expect(arc.degrees).toBeCloseTo(90);
        expect(arc.axis.y).toBeCloseTo(-1);
    });

    it("goes the way it was pushed when half a turn could go either way", () => {
        const back = CuboidUtils.getCountedOrientation(2, 0);

        expect(CuboidUtils.getArcBetween(FRONT, back, { yaw: 2, pitch: 0 })!.axis.y).toBeCloseTo(-1);
        expect(CuboidUtils.getArcBetween(FRONT, back, { yaw: -2, pitch: 0 })!.axis.y).toBeCloseTo(1);
    });
});

describe("getSettleKeyframes", () => {
    const angles = (frame: Keyframe) =>
        String(frame.transform)
            .match(/-?[\d.]+deg/g)!
            .map((value) => Number.parseFloat(value));

    it("has nothing to do when the box is already there", () => {
        expect(CuboidUtils.getSettleKeyframes(FRONT, FRONT, SIZE)).toEqual([]);
    });

    it("turns a single press a quarter turn and spins nothing when the new face already reads upright", () => {
        const frames = CuboidUtils.getSettleKeyframes(FRONT, CuboidUtils.turnUpright(FRONT, ACROSS), SIZE, ACROSS);

        expect(angles(frames[0]!)).toEqual([0, -90]);
        expect(angles(frames[2]!)).toEqual([0, 0]);
    });

    it("turns the quarter turn first and rights the face after, when it lands on its side", () => {
        const lid = CuboidUtils.turnUpright(FRONT, UP);
        const frames = CuboidUtils.getSettleKeyframes(lid, CuboidUtils.turnUpright(lid, ACROSS), SIZE, ACROSS);

        expect(angles(frames[0]!)[1], "the turn is a quarter").toBeCloseTo(-90);
        expect(Math.abs(angles(frames[2]!)[0]!), "and the spin is a quarter too").toBe(90);
        expect(frames[1]!.offset, "each taking half the time").toBeCloseTo(0.5);
    });

    it("tips over the top as a quarter turn, and only then spins the far side the right way up", () => {
        const lid = CuboidUtils.turnUpright(FRONT, UP);
        const frames = CuboidUtils.getSettleKeyframes(lid, CuboidUtils.turnUpright(lid, UP), SIZE, UP);

        expect(angles(frames[0]!)[1]).toBeCloseTo(-90);
        expect(Math.abs(angles(frames[2]!)[0]!)).toBe(180);
        expect(frames[1]!.offset, "the spin being twice as far, it takes twice as long").toBeCloseTo(1 / 3);
    });

    it("writes every keyframe with the same functions, so the browser only ever interpolates angles", () => {
        const lid = CuboidUtils.turnUpright(FRONT, UP);
        const frames = CuboidUtils.getSettleKeyframes(lid, CuboidUtils.turnUpright(lid, UP), SIZE, UP);
        const shapes = frames.map((frame) => String(frame.transform).replace(/-?[\d.e]+(deg)?/g, "#"));

        expect(new Set(shapes).size).toBe(1);
    });
});
