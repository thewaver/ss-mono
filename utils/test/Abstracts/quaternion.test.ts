import { describe, expect, it } from "vitest";

import { Matrix3dUtils } from "../../src/Abstracts/matrix3d.js";
import { QuaternionUtils } from "../../src/Abstracts/quaternion.js";

const ROTATIONS = [
    Matrix3dUtils.rotationX(30),
    Matrix3dUtils.rotationY(-120),
    Matrix3dUtils.rotationZ(170),
    Matrix3dUtils.multiply(Matrix3dUtils.rotationX(200), Matrix3dUtils.rotationY(75)),
];

describe("QuaternionUtils.fromMatrix / toMatrix", () => {
    it("turn a rotation into a quaternion and back without changing it", () => {
        ROTATIONS.forEach((rotation) => {
            const back = QuaternionUtils.toMatrix(QuaternionUtils.fromMatrix(rotation));

            back.forEach((value, index) => expect(value).toBeCloseTo(rotation[index], 9));
        });
    });
});

describe("QuaternionUtils.fromAxisAngle", () => {
    it("treats whole turns as no turn at all", () => {
        const twoTurns = QuaternionUtils.toMatrix(QuaternionUtils.fromAxisAngle({ x: 1, y: 2, z: 3 }, 720));

        [1, 0, 0, 0, 1, 0, 0, 0, 1].forEach((value, index) => expect(twoTurns[index]).toBeCloseTo(value, 9));
    });

    it("gives no turn about an axis of no length", () => {
        expect(QuaternionUtils.fromAxisAngle({ x: 0, y: 0, z: 0 }, 1)).toEqual(QuaternionUtils.IDENTITY);
    });

    it("turns the way the matching rotation matrix does", () => {
        const turned = QuaternionUtils.rotate(QuaternionUtils.fromAxisAngle({ x: 0, y: 0, z: 1 }, 90), {
            x: 1,
            y: 0,
            z: 0,
        });
        const expected = Matrix3dUtils.apply(Matrix3dUtils.rotationZ(90), { x: 1, y: 0, z: 0 });

        expect(turned.x).toBeCloseTo(expected.x, 9);
        expect(turned.y).toBeCloseTo(expected.y, 9);
        expect(turned.z).toBeCloseTo(expected.z, 9);
    });
});

describe("QuaternionUtils.multiply", () => {
    it("applies the right-hand turn first", () => {
        const first = QuaternionUtils.fromAxisAngle({ x: 1, y: 0, z: 0 }, 90);
        const second = QuaternionUtils.fromAxisAngle({ x: 0, y: 0, z: 1 }, 90);
        const combined = QuaternionUtils.rotate(QuaternionUtils.multiply(second, first), { x: 0, y: 1, z: 0 });
        const stepwise = QuaternionUtils.rotate(second, QuaternionUtils.rotate(first, { x: 0, y: 1, z: 0 }));

        expect(combined.x).toBeCloseTo(stepwise.x, 9);
        expect(combined.y).toBeCloseTo(stepwise.y, 9);
        expect(combined.z).toBeCloseTo(stepwise.z, 9);
    });
});

describe("QuaternionUtils.slerp", () => {
    it("blends from one turn to another, landing on each end", () => {
        const from = QuaternionUtils.fromAxisAngle({ x: 0, y: 1, z: 0 }, 0);
        const to = QuaternionUtils.fromAxisAngle({ x: 0, y: 1, z: 0 }, 90);
        const half = QuaternionUtils.slerp(from, to, 0.5);

        expect(QuaternionUtils.slerp(from, to, 1).w).toBeCloseTo(to.w, 9);
        expect(half.w).toBeCloseTo(Math.cos(Math.PI * 0.125), 9);
    });
});

describe("QuaternionUtils.normalize", () => {
    it("brings a turn back to length 1, and answers no turn for one of no length", () => {
        const scaled = QuaternionUtils.normalize({ w: 2, x: 0, y: 0, z: 0 });

        expect(scaled).toEqual({ w: 1, x: 0, y: 0, z: 0 });
        expect(QuaternionUtils.normalize({ w: 0, x: 0, y: 0, z: 0 })).toEqual(QuaternionUtils.IDENTITY);
    });
});
