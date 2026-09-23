import { describe, expect, it } from "vitest";

import { TreemapUtils } from "../Treemap/Treemap.utils";
import type { SunburstArc, SunburstNode } from "./Sunburst.types";
import { SunburstUtils } from "./Sunburst.utils";

const leaf = (value: string, weight: number): SunburstNode<string> => ({ value, weight });

const branch = (value: string, ...children: SunburstNode<string>[]): SunburstNode<string> => ({ value, children });

const SMALL = leaf("small", 1);
const LARGE = leaf("large", 3);
const INNER = branch("inner", SMALL, LARGE);
const SIDE = leaf("side", 4);
const ROOT = branch("root", SIDE, INNER);

const spans = SunburstUtils.computeSpans(ROOT, TreemapUtils.computeWeights(ROOT));

describe("computeSpans", () => {
    it("gives the root the whole turn in ring nought and its children the next ring out", () => {
        expect(spans.get(ROOT)).toEqual({ start: 0, end: 1, inner: 0, outer: 1 });
        expect(spans.get(INNER)?.inner).toBe(1);
        expect(spans.get(SMALL)?.inner).toBe(2);
    });

    it("shares a node's turn between its children by weight, heaviest first", () => {
        expect(spans.get(SIDE)).toMatchObject({ start: 0, end: 0.5 });
        expect(spans.get(INNER)).toMatchObject({ start: 0.5, end: 1 });
        expect(spans.get(LARGE)).toMatchObject({ start: 0.5, end: 0.875 });
        expect(spans.get(SMALL)).toMatchObject({ start: 0.875, end: 1 });
    });
});

describe("computeView", () => {
    const center = spans.get(INNER)!;

    it("stretches the center's turn to a whole one and moves its ring to nought", () => {
        expect(SunburstUtils.computeView(spans.get(LARGE)!, center)).toEqual({
            start: 0,
            end: 0.75,
            inner: 1,
            outer: 2,
        });
    });

    it("squeezes anything outside the center's turn to nothing and an ancestor into ring nought", () => {
        const side = SunburstUtils.computeView(spans.get(SIDE)!, center);
        const root = SunburstUtils.computeView(spans.get(ROOT)!, center);

        expect(side.end - side.start).toBe(0);
        expect(root).toMatchObject({ inner: 0, outer: 0 });
    });
});

describe("getIsVisible", () => {
    it("draws the rings between the first and the last, and nothing without width", () => {
        expect(SunburstUtils.getIsVisible({ start: 0, end: 0.5, inner: 1, outer: 2 }, 2)).toBe(true);
        expect(SunburstUtils.getIsVisible({ start: 0, end: 0.5, inner: 2, outer: 3 }, 2)).toBe(true);
        expect(SunburstUtils.getIsVisible({ start: 0, end: 0.5, inner: 3, outer: 4 }, 2)).toBe(false);
        expect(SunburstUtils.getIsVisible({ start: 0, end: 0.5, inner: 0, outer: 1 }, 2)).toBe(false);
        expect(SunburstUtils.getIsVisible({ start: 0.5, end: 0.5, inner: 1, outer: 2 }, 2)).toBe(false);
    });
});

describe("interpolateSpan", () => {
    it("lands on either end at nought and one, and halfway at a half", () => {
        const from = { start: 0, end: 0.5, inner: 1, outer: 2 };
        const to = { start: 0.5, end: 1, inner: 2, outer: 3 };

        expect(SunburstUtils.interpolateSpan(from, to, 0)).toEqual(from);
        expect(SunburstUtils.interpolateSpan(from, to, 1)).toEqual(to);
        expect(SunburstUtils.interpolateSpan(from, to, 0.5)).toEqual({
            start: 0.25,
            end: 0.75,
            inner: 1.5,
            outer: 2.5,
        });
    });
});

describe("toArc", () => {
    it("turns fractions of a turn into radians and rings into pixels", () => {
        expect(SunburstUtils.toArc({ start: 0, end: 0.5, inner: 1, outer: 2 }, 100)).toEqual({
            startAngle: 0,
            endAngle: Math.PI,
            innerRadius: 100,
            outerRadius: 200,
        });
    });
});

describe("computeArcPath", () => {
    const QUARTER: SunburstArc = { startAngle: 0, endAngle: Math.PI * 0.5, innerRadius: 100, outerRadius: 200 };

    it("draws nothing for an arc with no width or no depth", () => {
        expect(SunburstUtils.computeArcPath({ ...QUARTER, endAngle: 0 })).toBe("");
        expect(SunburstUtils.computeArcPath(QUARTER, { ringGap: 100 })).toBe("");
    });

    it("starts at twelve o'clock on the rim and turns clockwise", () => {
        expect(SunburstUtils.computeArcPath(QUARTER).startsWith("M0,-200A200,200 0 0 1 200,")).toBe(true);
    });

    it("draws a whole turn as a ring with a hole, in two halves each way", () => {
        const ring = SunburstUtils.computeArcPath({ ...QUARTER, endAngle: Math.PI * 2 });

        expect(ring.match(/A/g)).toHaveLength(4);
        expect(ring.match(/M/g)).toHaveLength(2);
    });
});

describe("computeLabelTransform", () => {
    const arcAround = (middle: number): SunburstArc => ({
        startAngle: (middle - 0.05) * Math.PI * 2,
        endAngle: (middle + 0.05) * Math.PI * 2,
        innerRadius: 100,
        outerRadius: 200,
    });

    it("keeps text upright on both halves of the circle", () => {
        expect(SunburstUtils.computeLabelTransform(arcAround(0.25))).toMatch(/rotate\(0\)$/);
        expect(SunburstUtils.computeLabelTransform(arcAround(0.75))).toMatch(/rotate\(180\)$/);
    });
});
