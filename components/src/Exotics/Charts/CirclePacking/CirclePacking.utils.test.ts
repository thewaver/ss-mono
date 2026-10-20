import { describe, expect, it } from "vitest";

import { type Circle, CircleUtils } from "@thewaver/ss-utils";

import { TreemapUtils } from "../Treemap/Treemap.utils";
import type { CirclePackingNode } from "./CirclePacking.types";
import { CirclePackingUtils } from "./CirclePacking.utils";

const leaf = (value: string, weight: number): CirclePackingNode<string> => ({ value, weight });

const branch = (value: string, ...children: CirclePackingNode<string>[]): CirclePackingNode<string> => ({
    value,
    children,
});

const TOLERANCE = 1e-6;

const distance = (first: Circle, second: Circle) => Math.hypot(first.x - second.x, first.y - second.y);

const contains = (outer: Circle, inner: Circle, gap = 0) =>
    distance(outer, inner) + inner.radius + gap <= outer.radius + TOLERANCE;

const apart = (first: Circle, second: Circle, gap = 0) =>
    distance(first, second) + TOLERANCE >= first.radius + second.radius + gap;

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

describe("project", () => {
    it("scales so the view's circle fills the drawing, about the view's center", () => {
        expect(CirclePackingUtils.project({ x: 110, y: 0, radius: 10 }, { x: 100, y: 0, radius: 20 }, 400)).toEqual({
            x: 100,
            y: 0,
            radius: 100,
        });
    });
});

describe("listNodes and computeDepths", () => {
    const INNER = branch("inner", leaf("a", 1), leaf("b", 2));
    const ROOT = branch("root", INNER, leaf("side", 3), leaf("empty", 0));
    const layout = CirclePackingUtils.computeLayout(ROOT, TreemapUtils.computeWeights(ROOT), 100, 1);

    it("lists the placed nodes but the root, outside in", () => {
        expect(CirclePackingUtils.listNodes(ROOT, layout).map((node) => node.value)).toEqual([
            "inner",
            "side",
            "a",
            "b",
        ]);
    });

    it("counts the root as nought", () => {
        const depths = CirclePackingUtils.computeDepths(ROOT);

        expect(depths.get(ROOT)).toBe(0);
        expect(depths.get(INNER)).toBe(1);
        expect(depths.get(INNER.children![0])).toBe(2);
    });
});

describe("computeShownView", () => {
    const target = { x: 10, y: 0, radius: 10 };
    const path = CircleUtils.interpolateZoom({ x: 0, y: 0, radius: 50 }, target);

    it("is the target once settled or without a path, and the path's start at the start", () => {
        expect(CirclePackingUtils.computeShownView(path, target, 1)).toEqual(target);
        expect(CirclePackingUtils.computeShownView(undefined, target, 0.5)).toEqual(target);
        expect(CirclePackingUtils.computeShownView(path, target, 0).radius).toBeCloseTo(50, 6);
    });
});
