import { describe, expect, it } from "vitest";

import { HoverIntentUtils } from "./HoverIntent.utils";

const DELAY_DEFS = {
    isShown: false,
    hoverShowDelayMs: 700,
    skipDelayWindowMs: 300,
    msSinceLastClose: Number.POSITIVE_INFINITY,
};

describe("HoverIntentUtils.computeShowDelayMs", () => {
    it("waits the whole delay when nothing in the group has closed", () => {
        expect(HoverIntentUtils.computeShowDelayMs(DELAY_DEFS)).toBe(700);
    });

    it("skips the wait inside the window after a close", () => {
        expect(HoverIntentUtils.computeShowDelayMs({ ...DELAY_DEFS, msSinceLastClose: 299 })).toBe(0);
    });

    it("waits again once the window has passed", () => {
        expect(HoverIntentUtils.computeShowDelayMs({ ...DELAY_DEFS, msSinceLastClose: 300 })).toBe(700);
    });

    it("does not wait for a panel that is already showing", () => {
        expect(HoverIntentUtils.computeShowDelayMs({ ...DELAY_DEFS, isShown: true })).toBe(0);
    });

    it("treats a delay of zero or less as at once", () => {
        expect(HoverIntentUtils.computeShowDelayMs({ ...DELAY_DEFS, hoverShowDelayMs: 0 })).toBe(0);
        expect(HoverIntentUtils.computeShowDelayMs({ ...DELAY_DEFS, hoverShowDelayMs: -5 })).toBe(0);
    });
});

describe("HoverIntentUtils.createDelayGroup", () => {
    it("starts with no close on record, so the first hover waits", () => {
        const group = HoverIntentUtils.createDelayGroup();

        expect(HoverIntentUtils.computeShowDelayMs({ ...DELAY_DEFS, msSinceLastClose: 0 - group.lastClosedAtMs })).toBe(
            700,
        );
    });
});

describe("HoverIntentUtils.computeBridgeInsets", () => {
    it("bridges only the side facing the anchor for a panel above it", () => {
        expect(HoverIntentUtils.computeBridgeInsets({ x: "center", y: "top-out" }, { x: 8, y: 10 })).toEqual({
            top: 0,
            right: 0,
            bottom: 10,
            left: 0,
        });
    });

    it("bridges the top for a panel below its anchor", () => {
        expect(HoverIntentUtils.computeBridgeInsets({ x: "left-in", y: "bottom-out" }, { x: 0, y: 6 })).toEqual({
            top: 6,
            right: 0,
            bottom: 0,
            left: 0,
        });
    });

    it("bridges across for a panel beside its anchor", () => {
        expect(HoverIntentUtils.computeBridgeInsets({ x: "right-out", y: "center" }, { x: 12, y: 0 })).toEqual({
            top: 0,
            right: 0,
            bottom: 0,
            left: 12,
        });
        expect(HoverIntentUtils.computeBridgeInsets({ x: "left-out", y: "center" }, { x: 12, y: 0 })).toEqual({
            top: 0,
            right: 12,
            bottom: 0,
            left: 0,
        });
    });

    it("bridges nothing for a placement that overlaps its anchor", () => {
        expect(HoverIntentUtils.computeBridgeInsets({ x: "center", y: "top-in" }, { x: 10, y: 10 })).toEqual({
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        });
    });

    it("clamps a negative or missing offset to no gap", () => {
        expect(HoverIntentUtils.computeBridgeInsets({ x: "center", y: "bottom-out" }, { x: 0, y: -10 })).toEqual({
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        });
        expect(HoverIntentUtils.computeBridgeInsets({ x: "center", y: "bottom-out" }, undefined)).toEqual({
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        });
    });
});
