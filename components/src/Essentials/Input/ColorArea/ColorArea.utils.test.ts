import { describe, expect, it } from "vitest";

import { ColorAreaUtils } from "./ColorArea.utils";

const HSV = { h: 210, s: 70, v: 90, a: 1 };

describe("getAxisPercent and computeValueText", () => {
    it("reads saturation and brightness off their channels", () => {
        expect(ColorAreaUtils.getAxisPercent(HSV, "saturation")).toBe(70);
        expect(ColorAreaUtils.getAxisPercent(HSV, "brightness")).toBe(90);
    });

    it("reads an axis out as a whole percentage", () => {
        expect(ColorAreaUtils.computeValueText({ ...HSV, s: 33.4 }, "saturation")).toBe("33%");
    });
});

describe("computeAxisHsv", () => {
    it("moves one axis and leaves the rest alone", () => {
        expect(ColorAreaUtils.computeAxisHsv(HSV, "saturation", 40)).toEqual({ ...HSV, s: 40 });
        expect(ColorAreaUtils.computeAxisHsv(HSV, "brightness", 10)).toEqual({ ...HSV, v: 10 });
    });

    it("holds the axis inside its percentage", () => {
        expect(ColorAreaUtils.computeAxisHsv(HSV, "saturation", 140).s).toBe(100);
        expect(ColorAreaUtils.computeAxisHsv(HSV, "brightness", -5).v).toBe(0);
    });
});

describe("computeDraggedHsv", () => {
    it("reads saturation across and brightness up", () => {
        expect(ColorAreaUtils.computeDraggedHsv(HSV, { x: 0.8, y: 0.2 })).toEqual({ ...HSV, s: 80, v: 80 });
    });

    it("puts full brightness at the top edge", () => {
        expect(ColorAreaUtils.computeDraggedHsv(HSV, { x: 0, y: 0 }).v).toBe(100);
    });
});
