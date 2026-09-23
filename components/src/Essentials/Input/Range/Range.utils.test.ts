import { describe, expect, it } from "vitest";

import { RangeUtils } from "./Range.utils";

const BOX = { left: 0, top: 0, width: 100, height: 100 };
const KNOB = { min: 0, max: 100, startAngle: 135, sweepAngle: 270 };

describe("computeAngularValue", () => {
    it("reads the start of the sweep as min and its end as max", () => {
        expect(RangeUtils.computeAngularValue({ x: 0, y: 100 }, BOX, KNOB)).toBeCloseTo(0);
        expect(RangeUtils.computeAngularValue({ x: 100, y: 100 }, BOX, KNOB)).toBeCloseTo(100);
    });

    it("reads the top of a bottom-opening knob as the middle of the range", () => {
        expect(RangeUtils.computeAngularValue({ x: 50, y: 0 }, BOX, KNOB)).toBeCloseTo(50);
        expect(RangeUtils.computeAngularValue({ x: 100, y: 50 }, BOX, KNOB)).toBeCloseTo(250 / 3);
    });

    it("sends a point in the gap to whichever end it is nearer", () => {
        expect(RangeUtils.computeAngularValue({ x: 45, y: 100 }, BOX, KNOB)).toBe(0);
        expect(RangeUtils.computeAngularValue({ x: 55, y: 100 }, BOX, KNOB)).toBe(100);
    });

    it("measures around the box's own center, wherever the box is", () => {
        const moved = { left: 200, top: 300, width: 100, height: 100 };

        expect(RangeUtils.computeAngularValue({ x: 250, y: 300 }, moved, KNOB)).toBeCloseTo(50);
    });

    it("runs the other way round for a negative sweep", () => {
        const counter = { min: 0, max: 100, startAngle: 45, sweepAngle: -270 };

        expect(RangeUtils.computeAngularValue({ x: 100, y: 100 }, BOX, counter)).toBeCloseTo(0);
        expect(RangeUtils.computeAngularValue({ x: 0, y: 100 }, BOX, counter)).toBeCloseTo(100);
    });

    it("covers a whole turn with a full sweep", () => {
        const dial = { min: 0, max: 360, startAngle: -90, sweepAngle: 360 };

        expect(RangeUtils.computeAngularValue({ x: 100, y: 50 }, BOX, dial)).toBeCloseTo(90);
        expect(RangeUtils.computeAngularValue({ x: 50, y: 100 }, BOX, dial)).toBeCloseTo(180);
    });

    it("reads the center, and a sweep of nothing, as min", () => {
        expect(RangeUtils.computeAngularValue({ x: 50, y: 50 }, BOX, KNOB)).toBe(0);
        expect(RangeUtils.computeAngularValue({ x: 100, y: 50 }, BOX, { ...KNOB, sweepAngle: 0 })).toBe(0);
    });
});

describe("computeSteppedValue", () => {
    it("rounds to the nearest step counted from min", () => {
        expect(RangeUtils.computeSteppedValue(47, { min: 0, max: 100, step: 5 })).toBe(45);
        expect(RangeUtils.computeSteppedValue(48, { min: 0, max: 100, step: 5 })).toBe(50);
        expect(RangeUtils.computeSteppedValue(4, { min: 1, max: 10, step: 3 })).toBe(4);
    });

    it("rounds back to the step's decimals", () => {
        expect(RangeUtils.computeSteppedValue(0.29, { min: 0, max: 1, step: 0.1 })).toBe(0.3);
    });

    it("clamps into the bounds", () => {
        expect(RangeUtils.computeSteppedValue(103, { min: 0, max: 100, step: 1 })).toBe(100);
        expect(RangeUtils.computeSteppedValue(-3, { min: 0, max: 100, step: 1 })).toBe(0);
    });

    it("leaves a value unrounded when there is no step", () => {
        expect(RangeUtils.computeSteppedValue(12.34, { min: 0, max: 100, step: 0 })).toBe(12.34);
    });
});
