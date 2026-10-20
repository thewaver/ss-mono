import { describe, expect, it } from "vitest";

import { Point3d, Point3dString, Point3dUtils } from "../../src/Abstracts/point3d.js";

describe("Point3d.min / max", () => {
    it("combines axis by axis", () => {
        expect(Point3d.min({ x: 1, y: 9, z: 4 }, { x: 5, y: 2, z: 4 })).toEqual({ x: 1, y: 2, z: 4 });
        expect(Point3d.max({ x: 1, y: 9, z: 4 }, { x: 5, y: 2, z: 4 })).toEqual({ x: 5, y: 9, z: 4 });
    });

    it("gives undefined if either side is missing", () => {
        expect(Point3d.min(undefined, { x: 1, y: 1, z: 1 })).toBeUndefined();
        expect(Point3d.max({ x: 1, y: 1, z: 1 }, undefined)).toBeUndefined();
    });
});

describe("Point3d arithmetic", () => {
    it("adds, subtracts, multiplies and divides axis by axis", () => {
        expect(Point3d.add({ x: 1, y: 2, z: 3 }, { x: 10, y: 20, z: 30 })).toEqual({ x: 11, y: 22, z: 33 });
        expect(Point3d.sub({ x: 10, y: 20, z: 30 }, { x: 1, y: 2, z: 3 })).toEqual({ x: 9, y: 18, z: 27 });
        expect(Point3d.mul({ x: 3, y: 4, z: 5 }, { x: 2, y: 5, z: 10 })).toEqual({ x: 6, y: 20, z: 50 });
        expect(Point3d.div({ x: 6, y: 20, z: 50 }, { x: 2, y: 5, z: 10 })).toEqual({ x: 3, y: 4, z: 5 });
    });

    it("scales by one number when paired with spread", () => {
        expect(Point3d.mul({ x: 1, y: 2, z: 3 }, Point3d.spread(10))).toEqual({ x: 10, y: 20, z: 30 });
    });

    it("does not modify either input", () => {
        const a = { x: 1, y: 2, z: 3 };
        const b = { x: 4, y: 5, z: 6 };

        Point3d.add(a, b);

        expect(a).toEqual({ x: 1, y: 2, z: 3 });
        expect(b).toEqual({ x: 4, y: 5, z: 6 });
    });
});

describe("Point3d.isSame", () => {
    it("needs every axis to match", () => {
        expect(Point3d.isSame({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 3 })).toBe(true);
        expect(Point3d.isSame({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 4 })).toBe(false);
    });

    it("is false if either side is missing", () => {
        expect(Point3d.isSame(undefined, { x: 1, y: 2, z: 3 })).toBe(false);
        expect(Point3d.isSame({ x: 1, y: 2, z: 3 }, undefined)).toBe(false);
    });
});

describe("Point3d.toString / Point3dString.fromString", () => {
    it("flattens a point into an upper case string", () => {
        expect(Point3d.toString({ x: 10, y: 20, z: 30 })).toBe("X10_Y20_Z30");
    });

    it("reads its own output back", () => {
        const p: Point3d = { x: -1.5, y: 0, z: 2.25 };

        expect(Point3dString.fromString(Point3d.toString(p))).toEqual(p);
    });
});

describe("Point3dUtils.dot / cross", () => {
    it("multiplies axis by axis and adds", () => {
        expect(Point3dUtils.dot({ x: 1, y: 2, z: 3 }, { x: 4, y: -5, z: 6 })).toBe(12);
    });

    it("finds the direction at right angles to two others, reversed when they are swapped", () => {
        expect(Point3dUtils.cross({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 })).toEqual({ x: 0, y: 0, z: 1 });
        expect(Point3dUtils.cross({ x: 0, y: 1, z: 0 }, { x: 1, y: 0, z: 0 })).toEqual({ x: 0, y: 0, z: -1 });
    });
});

describe("Point3dUtils.getLength / getNormal", () => {
    it("measures from the origin", () => {
        expect(Point3dUtils.getLength({ x: 2, y: 3, z: 6 })).toBe(7);
    });

    it("shrinks a direction to length 1, and leaves no direction as none", () => {
        expect(Point3dUtils.getNormal({ x: 0, y: 0, z: 5 })).toEqual({ x: 0, y: 0, z: 1 });
        expect(Point3dUtils.getNormal({ x: 0, y: 0, z: 0 })).toEqual({ x: 0, y: 0, z: 0 });
    });
});

describe("Point3dUtils.getCentroid", () => {
    it("averages the points", () => {
        expect(
            Point3dUtils.getCentroid([
                { x: 0, y: 0, z: 0 },
                { x: 4, y: 2, z: 6 },
            ]),
        ).toEqual({ x: 2, y: 1, z: 3 });
    });

    it("answers the origin for no points", () => {
        expect(Point3dUtils.getCentroid([])).toEqual({ x: 0, y: 0, z: 0 });
    });
});

describe("Point3dUtils.rotateAbout", () => {
    it("turns a point a quarter turn about a line, keeping its distance from it", () => {
        const turned = Point3dUtils.rotateAbout({ x: 2, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 0, y: 0, z: 3 }, 90);

        expect(turned.x).toBeCloseTo(1);
        expect(turned.y).toBeCloseTo(1);
        expect(turned.z).toBeCloseTo(0);
    });

    it("turns nothing about a line of no length", () => {
        expect(Point3dUtils.rotateAbout({ x: 2, y: 3, z: 4 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, 90)).toEqual({
            x: 2,
            y: 3,
            z: 4,
        });
    });
});

describe("Point3dUtils.fromCylindrical", () => {
    it("measures the angle round the axis the way polar coordinates do, and carries the depth", () => {
        const right = Point3dUtils.fromCylindrical(2, 0, 5);
        const down = Point3dUtils.fromCylindrical(2, 90, -1);

        expect(right).toEqual({ x: 2, y: 0, z: 5 });
        expect(down.x).toBeCloseTo(0);
        expect(down.y).toBeCloseTo(2);
        expect(down.z).toBe(-1);
    });
});

describe("Point3dUtils.project", () => {
    it("draws a point level with the screen where it is, and a further one nearer the middle", () => {
        expect(Point3dUtils.project({ x: 100, y: 50, z: 0 }, 900)).toEqual({ x: 100, y: 50 });
        expect(Point3dUtils.project({ x: 100, y: 50, z: -900 }, 900)).toEqual({ x: 50, y: 25 });
    });

    it("draws nothing level with the viewer or behind", () => {
        expect(Point3dUtils.project({ x: 1, y: 1, z: 900 }, 900)).toBeUndefined();
        expect(Point3dUtils.project({ x: 1, y: 1, z: 1000 }, 900)).toBeUndefined();
    });
});

describe("Point3dUtils.getConvexHull", () => {
    const CUBE = [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => ({ x, y, z }))));

    it("finds a cube's six square sides", () => {
        const faces = Point3dUtils.getConvexHull(CUBE);

        expect(faces).toHaveLength(6);
        faces.forEach((face) => expect(face).toHaveLength(4));
    });

    it("orders each face counterclockwise seen from outside", () => {
        Point3dUtils.getConvexHull(CUBE).forEach((face) => {
            const [a, b, c] = face.map((index) => CUBE[index]);
            const outward = Point3dUtils.cross(Point3d.sub(b, a), Point3d.sub(c, a));
            const center = Point3dUtils.getCentroid(face.map((index) => CUBE[index]));

            expect(Point3dUtils.dot(outward, center)).toBeGreaterThan(0);
        });
    });

    it("leaves a point inside the solid out of every face", () => {
        const faces = Point3dUtils.getConvexHull([...CUBE, { x: 0, y: 0, z: 0 }]);

        expect(faces.some((face) => face.includes(CUBE.length))).toBe(false);
    });

    it("answers no faces for points all in one plane", () => {
        expect(Point3dUtils.getConvexHull(CUBE.filter((point) => point.z === 1))).toEqual([]);
    });
});
