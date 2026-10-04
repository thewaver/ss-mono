import { describe, expect, it } from "vitest";

import type { Point3d } from "@thewaver/ss-utils";

import { DieUtils } from "../../Exotics/Perspective/Die/Die.utils";
import { DieShapes } from "../../Samples/Die/Shapes/DieShapes.const";
import type { RollerFace, RollerState } from "./Roller.types";
import { RollerUtils } from "./Roller.utils";

const RADIUS = 100;

const NO_TURN = { w: 1, x: 0, y: 0, z: 0 };

const CUBE: RollerFace[] = [
    { normal: { x: 0, y: 0, z: 1 }, down: { x: 0, y: 1, z: 0 } },
    { normal: { x: 0, y: 0, z: -1 }, down: { x: 0, y: 1, z: 0 } },
    { normal: { x: 1, y: 0, z: 0 }, down: { x: 0, y: 1, z: 0 } },
    { normal: { x: -1, y: 0, z: 0 }, down: { x: 0, y: 1, z: 0 } },
    { normal: { x: 0, y: 1, z: 0 }, down: { x: 0, y: 0, z: 1 } },
    { normal: { x: 0, y: -1, z: 0 }, down: { x: 0, y: 0, z: -1 } },
];
const FRONT = 0;
const BACK = 1;
const RIGHT_SIDE = 2;
const LEFT_SIDE = 3;
const BOTTOM = 4;

const STILL: RollerState = {
    orientation: NO_TURN,
    rollPhase: "still",
    isAwaitingTarget: false,
    isResting: false,
    restingFace: undefined,
};

const expectPoint = (actual: Point3d, expected: Point3d) => {
    expect(actual.x).toBeCloseTo(expected.x, 9);
    expect(actual.y).toBeCloseTo(expected.y, 9);
    expect(actual.z).toBeCloseTo(expected.z, 9);
};

const facesOf = (key: DieShapes.SampleKey) => DieUtils.computeFaceGeometry(DieShapes.SAMPLE_SHAPES[key], RADIUS);

describe("quaternions", () => {
    it("turn a rotation into a quaternion and back without changing it", () => {
        facesOf("d12").forEach((face) => {
            const rotation = RollerUtils.toRotation(RollerUtils.getLandingQuaternion(face));
            const back = RollerUtils.toRotation(RollerUtils.toQuaternion(rotation));

            back.forEach((value, index) => expect(value).toBeCloseTo(rotation[index], 9));
        });
    });

    it("blend from one rotation to another, landing on each end", () => {
        const from = RollerUtils.fromAxisAngle({ x: 0, y: 1, z: 0 }, 0);
        const to = RollerUtils.fromAxisAngle({ x: 0, y: 1, z: 0 }, Math.PI * 0.5);
        const half = RollerUtils.slerp(from, to, 0.5);

        expect(RollerUtils.slerp(from, to, 1).w).toBeCloseTo(to.w, 9);
        expect(half.w).toBeCloseTo(Math.cos(Math.PI * 0.125), 9);
    });

    it("treat whole turns as no turn at all, which is what lets a roll tumble and still land", () => {
        const twoTurns = RollerUtils.toRotation(RollerUtils.fromAxisAngle({ x: 1, y: 2, z: 3 }, Math.PI * 4));

        [1, 0, 0, 0, 1, 0, 0, 0, 1].forEach((value, index) => expect(twoTurns[index]).toBeCloseTo(value, 9));
    });

    it("give no turn about an axis of no length", () => {
        expect(RollerUtils.fromAxisAngle({ x: 0, y: 0, z: 0 }, 1)).toEqual(NO_TURN);
    });
});

describe("getLandingQuaternion", () => {
    it("turns every face of every die towards the viewer, the right way up", () => {
        DieShapes.SAMPLE_KEYS.forEach((key) =>
            facesOf(key).forEach((face) => {
                const landing = RollerUtils.getLandingQuaternion(face);

                expectPoint(RollerUtils.turnVector(landing, face.normal), { x: 0, y: 0, z: 1 });
                expectPoint(RollerUtils.turnVector(landing, face.down), { x: 0, y: 1, z: 0 });
            }),
        );
    });
});

describe("getClosestFace", () => {
    it("finds the face a landing was for, on every die", () => {
        DieShapes.SAMPLE_KEYS.forEach((key) => {
            const faces = facesOf(key);

            faces.forEach((face, index) =>
                expect(RollerUtils.getClosestFace(faces, RollerUtils.getLandingQuaternion(face)), key).toBe(index),
            );
        });
    });

    it("finds the face nearest the viewer part-way through a turn", () => {
        const slightlyRight = RollerUtils.fromAxisAngle({ x: 0, y: 1, z: 0 }, Math.PI * 0.2);
        const mostlyLeft = RollerUtils.fromAxisAngle({ x: 0, y: 1, z: 0 }, Math.PI * 0.3);

        expect(RollerUtils.getClosestFace(CUBE, slightlyRight)).toBe(FRONT);
        expect(RollerUtils.getClosestFace(CUBE, mostlyLeft)).toBe(LEFT_SIDE);
    });

    it("has no answer for a solid with no faces", () => {
        expect(RollerUtils.getClosestFace([], NO_TURN)).toBeUndefined();
    });
});

describe("getOppositeFace", () => {
    it("finds the face exactly behind on a solid with parallel faces", () => {
        expect(RollerUtils.getOppositeFace(CUBE, FRONT)).toBe(BACK);
        expect(RollerUtils.getOppositeFace(CUBE, RIGHT_SIDE)).toBe(LEFT_SIDE);
    });

    it("finds the face pointing most nearly away on a solid without them, and never the face itself", () => {
        const faces = facesOf("d4");

        faces.forEach((face, index) => {
            const opposite = RollerUtils.getOppositeFace(faces, index)!;
            const alignment = (other: RollerFace) =>
                face.normal.x * other.normal.x + face.normal.y * other.normal.y + face.normal.z * other.normal.z;

            expect(opposite).not.toBe(index);
            faces.forEach((other, otherIndex) => {
                if (otherIndex !== index) expect(alignment(faces[opposite])).toBeLessThanOrEqual(alignment(other));
            });
        });
    });

    it("has no answer for a face that does not exist", () => {
        expect(RollerUtils.getOppositeFace(CUBE, 40)).toBeUndefined();
    });
});

describe("getNextFace", () => {
    it("brings round the face on the left when stepping right, as a drag to the right would", () => {
        expect(RollerUtils.getNextFace(CUBE, NO_TURN, "right")).toBe(LEFT_SIDE);
        expect(RollerUtils.getNextFace(CUBE, NO_TURN, "left")).toBe(RIGHT_SIDE);
        expect(RollerUtils.getNextFace(CUBE, NO_TURN, "up")).toBe(BOTTOM);
    });

    it("always finds a different face, from every face of every die and in every direction", () => {
        DieShapes.SAMPLE_KEYS.forEach((key) => {
            const faces = facesOf(key);

            faces.forEach((face, index) =>
                (["left", "right", "up", "down"] as const).forEach((direction) => {
                    const next = RollerUtils.getNextFace(faces, RollerUtils.getLandingQuaternion(face), direction);

                    expect(next, `${key} ${index} ${direction}`).toBeDefined();
                    expect(next, `${key} ${index} ${direction}`).not.toBe(index);
                }),
            );
        });
    });
});

describe("getDragTurn", () => {
    it("turns the point under the pointer along with it, by the travel in radii", () => {
        const quarterRight = RollerUtils.getDragTurn((RADIUS * Math.PI) / 2, 0, RADIUS);
        const quarterDown = RollerUtils.getDragTurn(0, (RADIUS * Math.PI) / 2, RADIUS);

        expectPoint(RollerUtils.turnVector(quarterRight, { x: 0, y: 0, z: 1 }), { x: 1, y: 0, z: 0 });
        expectPoint(RollerUtils.turnVector(quarterDown, { x: 0, y: 0, z: 1 }), { x: 0, y: 1, z: 0 });
    });

    it("makes no turn for no movement or no size", () => {
        expect(RollerUtils.getDragTurn(0, 0, RADIUS)).toEqual(NO_TURN);
        expect(RollerUtils.getDragTurn(10, 10, 0)).toEqual(NO_TURN);
    });
});

describe("stepCoast", () => {
    it("turns as far in one long step as in two short ones, so the frame rate cannot change a coast", () => {
        const whole = RollerUtils.stepCoast(0.01, 160, 200);
        const first = RollerUtils.stepCoast(0.01, 80, 200);
        const second = RollerUtils.stepCoast(first.speed, 80, 200);

        expect(first.angle + second.angle).toBeCloseTo(whole.angle, 12);
        expect(second.speed).toBeCloseTo(whole.speed, 12);
    });

    it("loses about 63% of its speed over one momentum", () => {
        expect(RollerUtils.stepCoast(1, 300, 300).speed).toBeCloseTo(Math.exp(-1), 12);
    });

    it("stops at once with no momentum", () => {
        expect(RollerUtils.stepCoast(1, 16, 0)).toEqual({ angle: 0, speed: 0 });
    });
});

describe("clampFace", () => {
    it("truncates the owner's face and keeps it among the faces there are", () => {
        expect(RollerUtils.clampFace(2.7, 6)).toBe(2);
        expect(RollerUtils.clampFace(-3, 6)).toBe(0);
        expect(RollerUtils.clampFace(40, 6)).toBe(5);
    });
});

describe("getIsRollable and computePhase", () => {
    it("rolls only with a way to choose a face, two faces, and nothing under way", () => {
        expect(RollerUtils.getIsRollable(STILL, RollerUtils.getIsRotatable(false, 6), true)).toBe(true);
        expect(RollerUtils.getIsRollable(STILL, RollerUtils.getIsRotatable(false, 6), false)).toBe(false);
        expect(RollerUtils.getIsRollable(STILL, RollerUtils.getIsRotatable(false, 1), true)).toBe(false);
        expect(RollerUtils.getIsRollable(STILL, RollerUtils.getIsRotatable(true, 6), true)).toBe(false);
        expect(RollerUtils.getIsRollable({ ...STILL, rollPhase: "coasting" }, true, true)).toBe(false);
        expect(RollerUtils.getIsRollable({ ...STILL, isAwaitingTarget: true }, true, true)).toBe(false);
    });

    it("idles only with a delay, permission, no rest under way and somewhere to turn, and reports a turn as itself", () => {
        const allowed = { idleDelayMs: 1000, isIdleAllowed: true, isRotatable: true };

        expect(RollerUtils.computePhase(STILL, allowed)).toBe("idling");
        expect(RollerUtils.computePhase(STILL, { ...allowed, idleDelayMs: undefined })).toBe("still");
        expect(RollerUtils.computePhase(STILL, { ...allowed, isIdleAllowed: false })).toBe("still");
        expect(RollerUtils.computePhase({ ...STILL, isResting: true }, allowed)).toBe("still");
        expect(RollerUtils.computePhase({ ...STILL, rollPhase: "dragging" }, allowed)).toBe("dragging");
    });

    it("counts a roll that is still being chosen as busy, and drift as not", () => {
        expect(RollerUtils.getIsBusy({ ...STILL, isAwaitingTarget: true })).toBe(true);
        expect(RollerUtils.getIsBusy({ ...STILL, rollPhase: "settling" })).toBe(true);
        expect(RollerUtils.getIsBusy(STILL)).toBe(false);
    });
});
