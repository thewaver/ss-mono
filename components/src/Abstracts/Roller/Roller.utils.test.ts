import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { type Point3d, QuaternionUtils } from "@thewaver/ss-utils";

import { DieUtils } from "../../Exotics/Perspective/Die/Die.utils";
import { DieShapes } from "../../Samples/Die/Shapes/DieShapes.const";
import type { RollerFace, RollerState } from "./Roller.types";
import { RollerUtils } from "./Roller.utils";

vi.mock("../LiveAnnouncer/LiveAnnouncer.utils", () => ({
    LiveAnnouncerUtils: { reserve: () => {}, announce: () => {} },
}));

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

describe("getUprightLanding", () => {
    it("turns every face of every die towards the viewer, the right way up", () => {
        DieShapes.SAMPLE_KEYS.forEach((key) =>
            facesOf(key).forEach((face) => {
                const landing = RollerUtils.getUprightLanding(face);

                expectPoint(QuaternionUtils.rotate(landing, face.normal), { x: 0, y: 0, z: 1 });
                expectPoint(QuaternionUtils.rotate(landing, face.down), { x: 0, y: 1, z: 0 });
            }),
        );
    });
});

describe("getNearestLanding", () => {
    const STARTS = [
        NO_TURN,
        QuaternionUtils.fromAxisAngle({ x: 1, y: 1, z: 0 }, 40),
        QuaternionUtils.fromAxisAngle({ x: 0.3, y: -1, z: 0.5 }, 130),
    ];

    it("turns the face towards the viewer with its contour upright, on every die and from any turn", () => {
        DieShapes.SAMPLE_KEYS.forEach((key) =>
            facesOf(key).forEach((face) =>
                STARTS.forEach((start) => {
                    const landing = RollerUtils.getNearestLanding(face, start);
                    const down = QuaternionUtils.rotate(landing, face.down);
                    const turn = (Math.atan2(down.x, down.y) * 180) / Math.PI;
                    const sameLooking = 360 / face.turnSymmetry;
                    const offTurn = Math.abs(turn - Math.round(turn / sameLooking) * sameLooking);

                    expectPoint(QuaternionUtils.rotate(landing, face.normal), { x: 0, y: 0, z: 1 });
                    expect(offTurn, key).toBeCloseTo(0, 6);
                }),
            ),
        );
    });

    it("is the upright landing for a face that looks the same only after a whole turn", () => {
        STARTS.forEach((start) =>
            CUBE.forEach((face) => {
                const landing = RollerUtils.getNearestLanding(face, start);

                expectPoint(QuaternionUtils.rotate(landing, face.down), { x: 0, y: 1, z: 0 });
            }),
        );
    });
});

describe("getClosestFace", () => {
    it("finds the face a landing was for, on every die", () => {
        DieShapes.SAMPLE_KEYS.forEach((key) => {
            const faces = facesOf(key);

            faces.forEach((face, index) =>
                expect(RollerUtils.getClosestFace(faces, RollerUtils.getUprightLanding(face)), key).toBe(index),
            );
        });
    });

    it("finds the face nearest the viewer part-way through a turn", () => {
        const slightlyRight = QuaternionUtils.fromAxisAngle({ x: 0, y: 1, z: 0 }, 36);
        const mostlyLeft = QuaternionUtils.fromAxisAngle({ x: 0, y: 1, z: 0 }, 54);

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
                    const next = RollerUtils.getNextFace(faces, RollerUtils.getUprightLanding(face), direction);

                    expect(next, `${key} ${index} ${direction}`).toBeDefined();
                    expect(next, `${key} ${index} ${direction}`).not.toBe(index);
                }),
            );
        });
    });
});

describe("getNextFace, passing over a face", () => {
    it("turns past the face it is told to skip and on to the next", () => {
        expect(RollerUtils.getNextFace(CUBE, NO_TURN, "up", BOTTOM)).toBe(BACK);
    });

    it("lands on the skipped face after all when no other comes round", () => {
        const coin = CUBE.slice(FRONT, BACK + 1);

        expect(RollerUtils.getNextFace(coin, NO_TURN, "up", BACK)).toBe(BACK);
    });
});

describe("getDragTurn", () => {
    it("turns the point under the pointer along with it, by the travel in radii", () => {
        const quarterRight = RollerUtils.getDragTurn((RADIUS * Math.PI) / 2, 0, RADIUS);
        const quarterDown = RollerUtils.getDragTurn(0, (RADIUS * Math.PI) / 2, RADIUS);

        expectPoint(QuaternionUtils.rotate(quarterRight, { x: 0, y: 0, z: 1 }), { x: 1, y: 0, z: 0 });
        expectPoint(QuaternionUtils.rotate(quarterDown, { x: 0, y: 0, z: 1 }), { x: 0, y: 1, z: 0 });
    });

    it("makes no turn for no movement or no size", () => {
        expect(RollerUtils.getDragTurn(0, 0, RADIUS)).toEqual(NO_TURN);
        expect(RollerUtils.getDragTurn(10, 10, 0)).toEqual(NO_TURN);
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

describe("createRoller", () => {
    beforeEach(() => {
        vi.stubGlobal("requestAnimationFrame", () => 0);
        vi.stubGlobal("cancelAnimationFrame", () => {});
    });

    afterEach(() => vi.unstubAllGlobals());

    const createStepper = (faces: RollerFace[], start: number) => {
        let targetFace = start;

        const roller = RollerUtils.createRoller({
            getIsDisabled: () => false,
            getFaces: () => faces,
            getRollDurationMs: () => 0,
            getSettleDurationMs: () => 0,
            getTumbleCount: () => 0,
            getMomentumMs: () => 0,
            getRadius: () => RADIUS,
            getIsMovable: () => false,
            targetFace: [() => targetFace, (value) => (targetFace = value)],
            computeFaceLabel: (index) => String(index),
        });

        roller.rest(start);

        return (direction: "left" | "right" | "up" | "down") => {
            roller.step(direction);

            return roller.get().restingFace;
        };
    };

    it("never steps back to the face it came from when the same key is pressed again, on any die", () => {
        DieShapes.SAMPLE_KEYS.forEach((key) => {
            const faces = facesOf(key);

            faces.forEach((_, start) =>
                (["down", "right"] as const).forEach((direction) => {
                    const step = createStepper(faces, start);
                    const visited = [start, ...Array.from({ length: 12 }, () => step(direction))];

                    visited.forEach((face, index) => {
                        if (index >= 2) expect(face, `${key} from ${start}, ${direction}`).not.toBe(visited[index - 2]);
                    });
                }),
            );
        });
    });

    it("steps a cube back to the face it came from when the other key is pressed", () => {
        const faces = facesOf("d6");

        faces.forEach((_, start) =>
            (
                [
                    ["down", "up"],
                    ["right", "left"],
                ] as const
            ).forEach(([there, back]) => {
                const step = createStepper(faces, start);

                step(there);
                expect(step(back), `from ${start}, ${there} then ${back}`).toBe(start);
            }),
        );
    });

    it("rolls a cube round all four faces of the way it is pressed, as a real one rolls", () => {
        const step = createStepper(facesOf("d6"), FRONT);
        const visited = [FRONT, step("up"), step("up"), step("up"), step("up")];

        expect(new Set(visited.slice(0, 4)).size).toBe(4);
        expect(visited[4]).toBe(FRONT);
    });

    it("can roll again after a target function threw", async () => {
        let isThrowing = true;
        let targetFace = FRONT;

        const roller = RollerUtils.createRoller({
            getIsDisabled: () => false,
            getFaces: () => CUBE,
            getRollDurationMs: () => 0,
            getSettleDurationMs: () => 0,
            getTumbleCount: () => 0,
            getMomentumMs: () => 0,
            getRadius: () => RADIUS,
            getIsMovable: () => false,
            targetFace: [() => targetFace, (value) => (targetFace = value)],
            computeRollTarget: () => {
                if (isThrowing) throw new Error("no");

                return RIGHT_SIDE;
            },
            computeFaceLabel: (index) => String(index),
        });

        expect(roller.roll()).toBe(true);
        await vi.waitFor(() => expect(roller.get().isAwaitingTarget).toBe(false));

        isThrowing = false;

        expect(roller.roll()).toBe(true);
        await vi.waitFor(() => expect(roller.get().isResting).toBe(true));

        expect(targetFace).toBe(RIGHT_SIDE);
    });
});
