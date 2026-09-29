import { describe, expect, it } from "vitest";

import { StaircaseUtils } from "./Staircase.utils";

describe("computeStepDefs", () => {
    it("counts from the top running down and from the bottom running up", () => {
        expect(StaircaseUtils.computeStepDefs(1, 5, "down", 20)).toEqual({ index: 1, stepCount: 5, indent: 20 });
        expect(StaircaseUtils.computeStepDefs(1, 5, "up", 20)).toEqual({ index: 3, stepCount: 5, indent: 20 });
    });
});

describe("computeStepIndent", () => {
    it("steps one indent at a time by default", () => {
        expect(StaircaseUtils.computeStepIndent({ index: 3, stepCount: 5, indent: 20 }, undefined)).toBe(60);
    });

    it("takes the consumer's function, and never goes below nought", () => {
        expect(StaircaseUtils.computeStepIndent({ index: 3, stepCount: 5, indent: 20 }, () => 7)).toBe(7);
        expect(StaircaseUtils.computeStepIndent({ index: 3, stepCount: 5, indent: 20 }, () => -7)).toBe(0);
    });
});
