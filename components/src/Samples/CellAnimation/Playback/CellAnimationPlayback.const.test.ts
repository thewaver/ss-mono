import { describe, expect, it } from "vitest";

import { CellAnimationPlayback } from "./CellAnimationPlayback.const";

describe("CellAnimationPlaybackConst", () => {
    it("leaves a one-way pass at the length it was given, whichever way round it runs", () => {
        expect(CellAnimationPlayback.computeCycleDurationMs(2000)).toBe(2000);
        expect(CellAnimationPlayback.computeCycleDurationMs(2000, { dir: "normal", holdMs: 500 })).toBe(2000);
        expect(CellAnimationPlayback.computeCycleDurationMs(2000, { dir: "reverse", holdMs: 500 })).toBe(2000);
    });

    it("charges an alternating pass for both trips plus the hold between them", () => {
        expect(CellAnimationPlayback.computeCycleDurationMs(2000, { dir: "alternate" })).toBe(4000);
        expect(CellAnimationPlayback.computeCycleDurationMs(2000, { dir: "alternate", holdMs: 1000 })).toBe(5000);
        expect(CellAnimationPlayback.computeCycleDurationMs(2000, { dir: "alternate-reverse", holdMs: 1000 })).toBe(
            5000,
        );
        expect(CellAnimationPlayback.computeCycleDurationMs(2000, { dir: "alternate", holdMs: -1000 })).toBe(4000);
    });

    it("runs a normal pass forwards and a reverse one backwards", () => {
        for (const timeline of [0, 0.25, 0.5, 0.75, 1]) {
            expect(CellAnimationPlayback.computeGlobalTimeline(timeline, 2000)).toBe(timeline);
            expect(CellAnimationPlayback.computeGlobalTimeline(timeline, 2000, { dir: "reverse" })).toBe(1 - timeline);
        }
    });

    it("spends the first half of an alternating pass going out and the second coming back", () => {
        const at = (timeline: number) =>
            CellAnimationPlayback.computeGlobalTimeline(timeline, 2000, { dir: "alternate" });

        expect(at(0)).toBe(0);
        expect(at(0.25)).toBe(0.5);
        expect(at(0.5)).toBe(1);
        expect(at(0.75)).toBe(0.5);
        expect(at(1)).toBe(0);
    });

    it("parks at the far end for exactly the hold's share of the cycle", () => {
        const at = (timeline: number) =>
            CellAnimationPlayback.computeGlobalTimeline(timeline, 2000, { dir: "alternate", holdMs: 1000 });

        expect(at(0)).toBeCloseTo(0, 5);
        expect(at(0.2)).toBeCloseTo(0.5, 5);
        expect(at(0.4)).toBeCloseTo(1, 5);
        expect(at(0.5)).toBeCloseTo(1, 5);
        expect(at(0.6)).toBeCloseTo(1, 5);
        expect(at(0.8)).toBeCloseTo(0.5, 5);
        expect(at(1)).toBeCloseTo(0, 5);
    });

    it("starts an alternate-reverse pass at the far end and holds there instead", () => {
        const at = (timeline: number) =>
            CellAnimationPlayback.computeGlobalTimeline(timeline, 2000, { dir: "alternate-reverse", holdMs: 1000 });

        expect(at(0)).toBeCloseTo(1, 5);
        expect(at(0.2)).toBeCloseTo(0.5, 5);
        expect(at(0.4)).toBeCloseTo(0, 5);
        expect(at(0.6)).toBeCloseTo(0, 5);
        expect(at(0.8)).toBeCloseTo(0.5, 5);
        expect(at(1)).toBeCloseTo(1, 5);
    });

    it("ends an alternating pass where it started, so the next one joins onto it", () => {
        for (const holdMs of [0, 500, 5000]) {
            for (const dir of ["alternate", "alternate-reverse"] as const) {
                const first = CellAnimationPlayback.computeGlobalTimeline(0, 2000, { dir, holdMs });
                const last = CellAnimationPlayback.computeGlobalTimeline(1, 2000, { dir, holdMs });

                expect(last, `${dir} at a ${holdMs}ms hold`).toBeCloseTo(first, 5);
            }
        }
    });

    it("holds at the far end throughout rather than dividing by zero, when there is no trip to make", () => {
        expect(CellAnimationPlayback.computeGlobalTimeline(0, 0, { dir: "alternate", holdMs: 1000 })).toBe(1);
        expect(CellAnimationPlayback.computeGlobalTimeline(1, 0, { dir: "alternate", holdMs: 1000 })).toBe(1);
    });
});
