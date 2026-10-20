import { describe, expect, it } from "vitest";

import { type Circle, CircleUtils } from "../../src/Abstracts/circle.js";

const TOLERANCE = 1e-6;

const distance = (first: Circle, second: Circle) => Math.hypot(first.x - second.x, first.y - second.y);

const contains = (outer: Circle, inner: Circle, gap = 0) =>
    distance(outer, inner) + inner.radius + gap <= outer.radius + TOLERANCE;

const apart = (first: Circle, second: Circle, gap = 0) =>
    distance(first, second) + TOLERANCE >= first.radius + second.radius + gap;

describe("CircleUtils.pack", () => {
    const RADII = [9, 7, 5, 4, 4, 3, 2, 2, 1, 1];

    it("lays every circle against the others without any two overlapping", () => {
        const { circles } = CircleUtils.pack(RADII);

        circles.forEach((circle, index) =>
            circles.slice(index + 1).forEach((other) => expect(apart(circle, other)).toBe(true)),
        );
    });

    it("answers a radius that encloses them all about the origin", () => {
        const { circles, radius } = CircleUtils.pack(RADII);
        const around = { x: 0, y: 0, radius };

        circles.forEach((circle) => expect(contains(around, circle)).toBe(true));
    });

    it("sits two circles side by side, touching", () => {
        const { circles, radius } = CircleUtils.pack([3, 1]);

        expect(distance(circles[0], circles[1])).toBeCloseTo(4, 6);
        expect(radius).toBeCloseTo(4, 6);
    });

    it("packs the same way every time", () => {
        expect(CircleUtils.pack(RADII)).toEqual(CircleUtils.pack(RADII));
    });
});

describe("CircleUtils.enclose", () => {
    it("finds the smallest circle around two circles, touching both", () => {
        const around = CircleUtils.enclose([
            { x: -2, y: 0, radius: 1 },
            { x: 2, y: 0, radius: 1 },
        ]);

        expect(around.x).toBeCloseTo(0, 6);
        expect(around.y).toBeCloseTo(0, 6);
        expect(around.radius).toBeCloseTo(3, 6);
    });

    it("answers the circle itself when one already holds the rest", () => {
        const big = { x: 1, y: 1, radius: 10 };

        expect(CircleUtils.enclose([big, { x: 2, y: 2, radius: 1 }])).toEqual(big);
    });
});

describe("CircleUtils.interpolateZoom", () => {
    const FROM = { x: 0, y: 0, radius: 300 };
    const TO = { x: 120, y: -40, radius: 40 };

    it("starts on the first view and ends on the second", () => {
        const path = CircleUtils.interpolateZoom(FROM, TO);

        expect(path(0).x).toBeCloseTo(FROM.x, 6);
        expect(path(0).radius).toBeCloseTo(FROM.radius, 6);
        expect(path(1).x).toBeCloseTo(TO.x, 6);
        expect(path(1).y).toBeCloseTo(TO.y, 6);
        expect(path(1).radius).toBeCloseTo(TO.radius, 6);
    });

    it("only scales when the two views share a center", () => {
        const path = CircleUtils.interpolateZoom(FROM, { ...FROM, radius: 30 });

        expect(path(0.5)).toMatchObject({ x: 0, y: 0 });
        expect(path(1).radius).toBeCloseTo(30, 6);
    });
});
