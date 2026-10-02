import { describe, expect, it } from "vitest";

import { Matrix3dUtils } from "@thewaver/ss-utils";

import { DieShapes } from "../../../Samples/Die/Shapes/DieShapes.const";
import { DieUtils } from "./Die.utils";

const RADIUS = 100;

describe("computeHull", () => {
    it("finds the faces every tabletop die is known to have, with the corners each face is known to have", () => {
        const expected = {
            d4: [4, 3],
            d6: [6, 4],
            d8: [8, 3],
            d10: [10, 4],
            d12: [12, 5],
            d20: [20, 3],
            d100: [100, 3],
        };

        DieShapes.SAMPLE_KEYS.forEach((key) => {
            const shape = DieShapes.SAMPLE_SHAPES[key];
            const [faceCount, cornerCount] = expected[key];

            expect(shape.faces, key).toHaveLength(faceCount);
            shape.faces.forEach((face) => expect(face, key).toHaveLength(cornerCount));
        });
    });
});

describe("computeFaceGeometry", () => {
    it("points every face outward, with its center on its normal's side", () => {
        DieShapes.SAMPLE_KEYS.forEach((key) =>
            DieUtils.computeFaceGeometry(DieShapes.SAMPLE_SHAPES[key], RADIUS).forEach((face) => {
                const along =
                    face.center.x * face.normal.x + face.center.y * face.normal.y + face.center.z * face.normal.z;

                expect(along, key).toBeGreaterThan(0);
            }),
        );
    });

    it("shows a cube's face square-on, its box as wide as the cube's edge", () => {
        const [face] = DieUtils.computeFaceGeometry(DieShapes.SAMPLE_SHAPES.d6, RADIUS);
        const edge = (RADIUS * 2) / Math.sqrt(3);

        expect(face.size.width).toBeCloseTo(edge, 6);
        expect(face.size.height).toBeCloseTo(edge, 6);
    });
});

describe("computeFacingRotation", () => {
    it("turns a face towards the viewer with its first corner up the screen", () => {
        DieUtils.computeFaceGeometry(DieShapes.SAMPLE_SHAPES.d20, RADIUS).forEach((face) => {
            const rotation = DieUtils.computeFacingRotation(face);
            const normal = Matrix3dUtils.apply(rotation, face.normal);
            const down = Matrix3dUtils.apply(rotation, face.down);

            expect(normal.z).toBeCloseTo(1, 9);
            expect(down.y).toBeCloseTo(1, 9);
        });
    });
});

describe("quaternions", () => {
    it("turn a rotation into a quaternion and back without changing it", () => {
        DieUtils.computeFaceGeometry(DieShapes.SAMPLE_SHAPES.d12, RADIUS).forEach((face) => {
            const rotation = DieUtils.computeFacingRotation(face);
            const back = DieUtils.toRotation(DieUtils.toQuaternion(rotation));

            back.forEach((value, index) => expect(value).toBeCloseTo(rotation[index], 9));
        });
    });

    it("blend from one rotation to another, landing on each end", () => {
        const from = DieUtils.fromAxisAngle({ x: 0, y: 1, z: 0 }, 0);
        const to = DieUtils.fromAxisAngle({ x: 0, y: 1, z: 0 }, Math.PI * 0.5);
        const half = DieUtils.slerp(from, to, 0.5);

        expect(DieUtils.slerp(from, to, 1).w).toBeCloseTo(to.w, 9);
        expect(half.w).toBeCloseTo(Math.cos(Math.PI * 0.125), 9);
    });

    it("treat whole turns as no turn at all, which is what lets a roll tumble and still land", () => {
        const twoTurns = DieUtils.toRotation(DieUtils.fromAxisAngle({ x: 1, y: 2, z: 3 }, Math.PI * 4));

        [1, 0, 0, 0, 1, 0, 0, 0, 1].forEach((value, index) => expect(twoTurns[index]).toBeCloseTo(value, 9));
    });
});

describe("clampFace", () => {
    it("truncates the owner's face and keeps it among the faces there are", () => {
        expect(DieUtils.clampFace(2.7, 6)).toBe(2);
        expect(DieUtils.clampFace(-3, 6)).toBe(0);
        expect(DieUtils.clampFace(40, 6)).toBe(5);
    });
});

describe("getFaceBox", () => {
    it("centers a face's box inside the die and clips it to a contour written in the box's own space", () => {
        const face = {
            center: { x: 0, y: 0, z: 1 },
            normal: { x: 0, y: 0, z: 1 },
            right: { x: 1, y: 0, z: 0 },
            down: { x: 0, y: 1, z: 0 },
            size: { width: 40, height: 20 },
            contour: [
                { x: -20, y: -10 },
                { x: 20, y: -10 },
                { x: 0, y: 10 },
            ],
        };
        const box = DieUtils.getFaceBox(face, 100);

        expect(box.left).toBe(30);
        expect(box.top).toBe(40);
        expect(box.clipPath).toBe("polygon(0px 0px,40px 0px,20px 20px)");
    });
});
