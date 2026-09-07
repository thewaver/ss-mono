import { describe, expect, it } from "vitest";

import { ScratchCardUtils } from "./ScratchCard.utils";

const TRIANGLE = ({ width, height }: { width: number; height: number }) => [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: 0, y: height },
];

describe("computeStampPath", () => {
    it("draws a closed circle out of two arcs when the brush has no shape of its own", () => {
        const d = ScratchCardUtils.computeStampPath({ x: 100, y: 50 }, 20, undefined);

        expect(d.startsWith("M80.0 50.0"), "it opens at the brush's left edge").toBe(true);
        expect((d.match(/A/g) ?? []).length, "a full circle takes two arcs, since one cannot close").toBe(2);
        expect(d.endsWith("Z"), "and it closes, so the fill rule has something to fill").toBe(true);
    });

    it("traces the shape's own points when it has them, offset onto the pointer", () => {
        const points = ScratchCardUtils.computeBrushPoints({ radius: 20, computePoints: TRIANGLE })!;
        const d = ScratchCardUtils.computeStampPath({ x: 100, y: 50 }, 20, points);

        expect(d, "the first point sits a radius up and left of the pointer").toContain("M80.0 30.0");
        expect(d, "and the shape spans twice the radius").toContain("120.0");
        expect(d.endsWith("Z")).toBe(true);
    });

    it("winds every stamp the same way, which is what lets them union rather than cancel", () => {
        const points = ScratchCardUtils.computeBrushPoints({ radius: 20, computePoints: TRIANGLE })!;
        const first = ScratchCardUtils.computeStampPath({ x: 100, y: 50 }, 20, points);
        const second = ScratchCardUtils.computeStampPath({ x: 130, y: 50 }, 20, points);
        const order = (d: string) => d.split(/[ML]/).length;

        expect(order(second), "the same shape translated visits its points in the same order").toBe(order(first));
    });
});

describe("computeProbePoints", () => {
    it("asks about the centre and the four points a radius out", () => {
        const probes = ScratchCardUtils.computeProbePoints({ x: 100, y: 50 }, 20);

        expect(probes).toEqual([
            { x: 100, y: 50 },
            { x: 120, y: 50 },
            { x: 80, y: 50 },
            { x: 100, y: 70 },
            { x: 100, y: 30 },
        ]);
    });

    it("reaches exactly as far as the brush does, so a stamp is only refused when it would add nothing", () => {
        const probes = ScratchCardUtils.computeProbePoints({ x: 0, y: 0 }, 40);
        const distances = probes.slice(1).map((probe) => Math.hypot(probe.x, probe.y));

        expect(distances.every((distance) => distance === 40)).toBe(true);
    });
});

describe("computeSamplePoints", () => {
    const SIZE = { width: 600, height: 300 };

    it("lays a square count of samples whatever shape the card is", () => {
        expect(ScratchCardUtils.computeSamplePoints(SIZE, 4).length, "four per axis is sixteen").toBe(16);
        expect(
            ScratchCardUtils.computeSamplePoints({ width: 100, height: 900 }, 4).length,
            "and it stays sixteen on a card of the opposite shape, so the cost cannot follow the aspect ratio",
        ).toBe(16);
    });

    it("puts each sample at the centre of the share of the card it stands for", () => {
        const [first] = ScratchCardUtils.computeSamplePoints(SIZE, 2);

        expect(first).toEqual({ x: 150, y: 75 });
    });

    it("spreads them across the whole card rather than bunching at one end", () => {
        const points = ScratchCardUtils.computeSamplePoints(SIZE, 4);

        expect(Math.min(...points.map((point) => point.x))).toBeGreaterThan(0);
        expect(Math.max(...points.map((point) => point.x))).toBeLessThan(SIZE.width);
        expect(new Set(points.map((point) => point.y)).size, "four distinct rows").toBe(4);
    });

    it("never asks for fewer than one sample, however small the precision", () => {
        expect(ScratchCardUtils.computeSamplePoints(SIZE, 0).length).toBe(1);
    });
});

describe("computeClearedRatio", () => {
    it("reports the share of samples that fell inside what has been rubbed", () => {
        expect(ScratchCardUtils.computeClearedRatio(256, 1024)).toBe(0.25);
    });

    it("never reports more than the whole of it", () => {
        expect(ScratchCardUtils.computeClearedRatio(2000, 1024)).toBe(1);
    });

    it("reports nothing when there was nothing to sample", () => {
        expect(ScratchCardUtils.computeClearedRatio(0, 0)).toBe(0);
    });
});

describe("computeBlurDeviation", () => {
    it("is nothing at all when the edge is asked to be perfectly hard", () => {
        expect(ScratchCardUtils.computeBlurDeviation(30, 1)).toBe(0);
    });

    it("grows with the brush, so the same softness looks the same at any size", () => {
        expect(ScratchCardUtils.computeBlurDeviation(60, 0.5)).toBe(ScratchCardUtils.computeBlurDeviation(30, 0.5) * 2);
    });
});

describe("computeBrushClipPath", () => {
    it("is a circle when the consumer named no shape, which is the brush's default", () => {
        expect(ScratchCardUtils.computeBrushClipPath({ radius: 20 })).toBe("circle(50%)");
    });

    it("traces the shape the consumer asked for, sized to the brush rather than to the card", () => {
        const clip = ScratchCardUtils.computeBrushClipPath({ radius: 20, computePoints: TRIANGLE });

        expect(clip.startsWith('path("')).toBe(true);
        expect(clip, "the points were asked for at twice the radius on each side").toContain("40");
    });
});

describe("computeBrushBox", () => {
    it("centres the brush on the pointer and sizes it from the radius alone", () => {
        expect(ScratchCardUtils.computeBrushBox({ x: 100, y: 60 }, 20)).toEqual({
            x: 80,
            y: 40,
            width: 40,
            height: 40,
        });
    });

    it("tracks the pointer exactly rather than snapping to anything", () => {
        const first = ScratchCardUtils.computeBrushBox({ x: 100, y: 60 }, 20);
        const second = ScratchCardUtils.computeBrushBox({ x: 101, y: 60 }, 20);

        expect(second.width).toBe(first.width);
        expect(second.x - first.x).toBe(1);
    });
});
