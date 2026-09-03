import { describe, expect, it } from "vitest";

import { TrailUtils } from "./Trail.utils";

const HALF_WAY = 0.5;
const QUARTER = 0.25;
const DURATION_MS = 1000;

describe("getSteppedProgress", () => {
    it("moves by the share of the duration the frame took", () => {
        expect(TrailUtils.getSteppedProgress(0, 250, DURATION_MS, false)).toEqual({
            progress: QUARTER,
            hasLapped: false,
        });
    });

    it("stops at the end when it is not looping, however long the frame was", () => {
        expect(TrailUtils.getSteppedProgress(HALF_WAY, 5000, DURATION_MS, false)).toEqual({
            progress: 1,
            hasLapped: true,
        });
    });

    it("carries the overshoot into the next lap when it is looping, so a slow frame does not lose ground", () => {
        const step = TrailUtils.getSteppedProgress(0.9, 200, DURATION_MS, true);

        expect(step.progress).toBeCloseTo(0.1);
        expect(step.hasLapped).toBe(true);
    });

    it("reports a lap on the frame that reaches the end exactly", () => {
        expect(TrailUtils.getSteppedProgress(HALF_WAY, 500, DURATION_MS, true).hasLapped).toBe(true);
    });

    it("arrives at once when there is no duration to spread the travel over", () => {
        expect(TrailUtils.getSteppedProgress(0, 16, 0, true)).toEqual({ progress: 1, hasLapped: true });
    });

    it("treats a frame that went backwards as no time passing at all", () => {
        expect(TrailUtils.getSteppedProgress(QUARTER, -100, DURATION_MS, false).progress).toBe(QUARTER);
    });
});

describe("getSampleSpan", () => {
    it("straddles the point, so the direction comes from both sides of it", () => {
        expect(TrailUtils.getSampleSpan(100, 50, 1)).toEqual({ from: 49, to: 51 });
    });

    it("does not sample before the start of the path", () => {
        expect(TrailUtils.getSampleSpan(100, 0, 1)).toEqual({ from: 0, to: 1 });
    });

    it("does not sample past the end of the path", () => {
        expect(TrailUtils.getSampleSpan(100, 100, 1)).toEqual({ from: 99, to: 100 });
    });
});

describe("getAngle", () => {
    it("reports nothing turned for travel to the right, which is where a shape drawn upright points", () => {
        expect(TrailUtils.getAngle({ x: 0, y: 0 }, { x: 10, y: 0 })).toBe(0);
    });

    it("reports a quarter turn for travel down the screen", () => {
        expect(TrailUtils.getAngle({ x: 0, y: 0 }, { x: 0, y: 10 })).toBe(90);
    });

    it("reports the opposite sign for travel up the screen", () => {
        expect(TrailUtils.getAngle({ x: 0, y: 0 }, { x: 0, y: -10 })).toBe(-90);
    });

    it("reads the diagonal between the two, rather than snapping to an axis", () => {
        expect(TrailUtils.getAngle({ x: 0, y: 0 }, { x: 10, y: 10 })).toBe(45);
    });
});
