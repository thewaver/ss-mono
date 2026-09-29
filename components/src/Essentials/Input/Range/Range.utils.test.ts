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

describe("computeValues, computeRatios and computeFill", () => {
    it("reads a pair as two values and a single value as one, defaulting to min", () => {
        expect(RangeUtils.computeValues({ start: 20, end: 80 }, undefined, 0)).toEqual([20, 80]);
        expect(RangeUtils.computeValues(undefined, 40, 0)).toEqual([40]);
        expect(RangeUtils.computeValues(undefined, undefined, 5)).toEqual([5]);
    });

    it("places each thumb as a share of the scale, held inside the track", () => {
        expect(RangeUtils.computeRatios([25, 150], 0, 100)).toEqual([0.25, 1]);
    });

    it("fills between a pair's thumbs, and from the start for a single one", () => {
        expect(RangeUtils.computeFill([0.2, 0.8])).toEqual({ start: 0.2, end: 0.8 });
        expect(RangeUtils.computeFill([0.4])).toEqual({ start: 0, end: 0.4 });
    });
});

describe("computeMovedRange", () => {
    it("moves only the end asked for", () => {
        expect(RangeUtils.computeMovedRange({ start: 20, end: 80 }, 0, 30)).toEqual({ start: 30, end: 80 });
        expect(RangeUtils.computeMovedRange({ start: 20, end: 80 }, 1, 60)).toEqual({ start: 20, end: 60 });
    });
});

describe("computeThumbBounds", () => {
    it("bounds each thumb of a pair by its neighbor", () => {
        expect(RangeUtils.computeThumbBounds([20, 80], 0, 0, 100)).toEqual({ min: 0, max: 80 });
        expect(RangeUtils.computeThumbBounds([20, 80], 1, 0, 100)).toEqual({ min: 20, max: 100 });
    });

    it("bounds a single thumb by the scale", () => {
        expect(RangeUtils.computeThumbBounds([40], 0, 0, 100)).toEqual({ min: 0, max: 100 });
    });
});

describe("suffixForThumb", () => {
    it("suffixes a pair's thumbs and leaves a single one alone", () => {
        expect(RangeUtils.suffixForThumb("price", 0, 2)).toBe("price-start");
        expect(RangeUtils.suffixForThumb("price", 1, 2)).toBe("price-end");
        expect(RangeUtils.suffixForThumb("price", 0, 1)).toBe("price");
        expect(RangeUtils.suffixForThumb(undefined, 0, 2)).toBeUndefined();
    });
});

describe("computePointerValue", () => {
    const RECT = { left: 0, right: 120, top: 0, bottom: 120, width: 120, height: 120 };
    const SCALE = { orientation: "horizontal", direction: "ltr", min: 0, max: 100, step: 1, thumbSize: 20 } as const;

    it("reads across the thumb's travel rather than the whole track", () => {
        expect(RangeUtils.computePointerValue({ x: 10, y: 0 }, RECT, SCALE)).toBe(0);
        expect(RangeUtils.computePointerValue({ x: 60, y: 0 }, RECT, SCALE)).toBe(50);
        expect(RangeUtils.computePointerValue({ x: 110, y: 0 }, RECT, SCALE)).toBe(100);
    });

    it("counts from the right under right-to-left", () => {
        expect(RangeUtils.computePointerValue({ x: 110, y: 0 }, RECT, { ...SCALE, direction: "rtl" })).toBe(0);
    });

    it("counts up from the bottom when vertical", () => {
        expect(RangeUtils.computePointerValue({ x: 0, y: 110 }, RECT, { ...SCALE, orientation: "vertical" })).toBe(0);
        expect(RangeUtils.computePointerValue({ x: 0, y: 10 }, RECT, { ...SCALE, orientation: "vertical" })).toBe(100);
    });
});

describe("computeNearestThumb", () => {
    it("picks the thumb nearest the value", () => {
        expect(RangeUtils.computeNearestThumb([20, 80], 30)).toBe(0);
        expect(RangeUtils.computeNearestThumb([20, 80], 70)).toBe(1);
    });

    it("breaks a tie by the side of the pile the value is on", () => {
        expect(RangeUtils.computeNearestThumb([80, 80], 60)).toBe(0);
        expect(RangeUtils.computeNearestThumb([80, 80], 90)).toBe(1);
    });
});
