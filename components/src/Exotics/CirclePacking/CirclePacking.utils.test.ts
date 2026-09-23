import { describe, expect, it } from "vitest";

import { TreemapUtils } from "../Treemap/Treemap.utils";
import type { CirclePackingCircle, CirclePackingNode } from "./CirclePacking.types";
import { CirclePackingUtils } from "./CirclePacking.utils";

const leaf = (value: string, weight: number): CirclePackingNode<string> => ({ value, weight });

const branch = (value: string, ...children: CirclePackingNode<string>[]): CirclePackingNode<string> => ({
    value,
    children,
});

const TOLERANCE = 1e-6;

const distance = (first: CirclePackingCircle, second: CirclePackingCircle) =>
    Math.hypot(first.x - second.x, first.y - second.y);

const contains = (outer: CirclePackingCircle, inner: CirclePackingCircle, gap = 0) =>
    distance(outer, inner) + inner.radius + gap <= outer.radius + TOLERANCE;

const apart = (first: CirclePackingCircle, second: CirclePackingCircle, gap = 0) =>
    distance(first, second) + TOLERANCE >= first.radius + second.radius + gap;

describe("packSiblings", () => {
    const RADII = [9, 7, 5, 4, 4, 3, 2, 2, 1, 1];

    it("lays every circle against the others without any two overlapping", () => {
        const { circles } = CirclePackingUtils.packSiblings(RADII);

        circles.forEach((circle, index) =>
            circles.slice(index + 1).forEach((other) => expect(apart(circle, other)).toBe(true)),
        );
    });

    it("answers a radius that encloses them all about the origin", () => {
        const { circles, radius } = CirclePackingUtils.packSiblings(RADII);
        const around = { x: 0, y: 0, radius };

        circles.forEach((circle) => expect(contains(around, circle)).toBe(true));
    });

    it("sits two circles side by side, touching", () => {
        const { circles, radius } = CirclePackingUtils.packSiblings([3, 1]);

        expect(distance(circles[0], circles[1])).toBeCloseTo(4, 6);
        expect(radius).toBeCloseTo(4, 6);
    });

    it("packs the same way every time", () => {
        expect(CirclePackingUtils.packSiblings(RADII)).toEqual(CirclePackingUtils.packSiblings(RADII));
    });
});

describe("enclose", () => {
    it("finds the smallest circle around two circles, touching both", () => {
        const around = CirclePackingUtils.enclose([
            { x: -2, y: 0, radius: 1 },
            { x: 2, y: 0, radius: 1 },
        ]);

        expect(around.x).toBeCloseTo(0, 6);
        expect(around.y).toBeCloseTo(0, 6);
        expect(around.radius).toBeCloseTo(3, 6);
    });

    it("answers the circle itself when one already holds the rest", () => {
        const big = { x: 1, y: 1, radius: 10 };

        expect(CirclePackingUtils.enclose([big, { x: 2, y: 2, radius: 1 }])).toEqual(big);
    });
});

describe("computeLayout", () => {
    const INNER = branch("inner", leaf("a", 4), leaf("b", 1), leaf("c", 1));
    const ROOT = branch("root", INNER, leaf("side", 9), leaf("empty", 0));
    const SIDE = 600;
    const PADDING = 3;

    const layout = CirclePackingUtils.computeLayout(ROOT, TreemapUtils.computeWeights(ROOT), SIDE, PADDING);

    it("fills the square with the root, centered on the origin", () => {
        expect(layout.get(ROOT)).toEqual({ x: 0, y: 0, radius: SIDE * 0.5 });
    });

    it("keeps every child inside its parent and apart from its siblings, with the padding between", () => {
        const children = ROOT.children!.filter((child) => layout.has(child));

        children.forEach((child) =>
            expect(contains(layout.get(ROOT)!, layout.get(child)!, PADDING - TOLERANCE)).toBe(true),
        );
        INNER.children!.forEach((child) =>
            expect(contains(layout.get(INNER)!, layout.get(child)!, PADDING - TOLERANCE)).toBe(true),
        );
        expect(apart(layout.get(INNER.children![1])!, layout.get(INNER.children![2])!, PADDING - TOLERANCE)).toBe(true);
    });

    it("gives leaves areas in proportion to their weights", () => {
        const a = layout.get(INNER.children![0])!.radius;
        const b = layout.get(INNER.children![1])!.radius;

        expect((a * a) / (b * b)).toBeCloseTo(4, 6);
    });

    it("leaves out a child weighing nothing", () => {
        expect(layout.has(ROOT.children![2])).toBe(false);
    });
});

describe("interpolateZoom", () => {
    const FROM = { x: 0, y: 0, diameter: 600 };
    const TO = { x: 120, y: -40, diameter: 80 };

    it("starts on the first view and ends on the second", () => {
        const path = CirclePackingUtils.interpolateZoom(FROM, TO);

        expect(path(0).x).toBeCloseTo(FROM.x, 6);
        expect(path(0).diameter).toBeCloseTo(FROM.diameter, 6);
        expect(path(1).x).toBeCloseTo(TO.x, 6);
        expect(path(1).y).toBeCloseTo(TO.y, 6);
        expect(path(1).diameter).toBeCloseTo(TO.diameter, 6);
    });

    it("only scales when the two views share a center", () => {
        const path = CirclePackingUtils.interpolateZoom(FROM, { ...FROM, diameter: 60 });

        expect(path(0.5)).toMatchObject({ x: 0, y: 0 });
        expect(path(1).diameter).toBeCloseTo(60, 6);
    });
});

describe("project", () => {
    it("scales so the view's diameter fills the drawing, about the view's center", () => {
        expect(CirclePackingUtils.project({ x: 110, y: 0, radius: 10 }, { x: 100, y: 0, diameter: 40 }, 400)).toEqual({
            x: 100,
            y: 0,
            radius: 100,
        });
    });
});
