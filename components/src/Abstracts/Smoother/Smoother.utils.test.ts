import { describe, expect, it } from "vitest";

import { SmootherUtils } from "./Smoother.utils";

describe("SmootherUtils.getStep", () => {
    it("lands on the target at once when there is no smoothing", () => {
        expect(SmootherUtils.getStep(0, 10, 16, 0)).toBe(10);
    });

    it("closes the same share of the gap however the time is cut into frames", () => {
        const once = SmootherUtils.getStep(0, 10, 32, 100);
        const twice = SmootherUtils.getStep(SmootherUtils.getStep(0, 10, 16, 100), 10, 16, 100);

        expect(twice).toBeCloseTo(once, 10);
    });

    it("closes about 63% of the gap after one smoothing time", () => {
        expect(SmootherUtils.getStep(0, 1, 100, 100)).toBeCloseTo(1 - Math.exp(-1), 10);
    });

    it("does not move for a negative time", () => {
        expect(SmootherUtils.getStep(3, 10, -16, 100)).toBe(3);
    });

    it("never passes the target", () => {
        expect(SmootherUtils.getStep(0, 10, 1_000_000, 100)).toBeLessThanOrEqual(10);
    });
});

describe("SmootherUtils.getStep from a value that is not finite", () => {
    it("lands on the target, rather than staying not a number", () => {
        expect(SmootherUtils.getStep(Infinity, 5, 16, 100)).toBe(5);
        expect(SmootherUtils.getStep(Number.NaN, 5, 16, 100)).toBe(5);
    });
});
