import { describe, expect, it } from "vitest";

import type { SplitPaneEntry } from "./SplitPane.types";
import { SplitPaneUtils } from "./SplitPane.utils";

const PAIR: SplitPaneEntry[] = [{}, {}];
const BOUNDED: SplitPaneEntry[] = [{ minPx: 120, maxPx: 220 }, { minPx: 160 }];

describe("SplitPaneUtils.computeRatios", () => {
    it("gives a pane the stored ratios do not cover an even share", () => {
        expect(SplitPaneUtils.computeRatios(3, [0.5])).toEqual([0.5, 1 / 3, 1 / 3]);
    });
});

describe("SplitPaneUtils.computeTemplate", () => {
    it("writes each pane as its share of the room left after the gutters, with fixed gutters between", () => {
        expect(SplitPaneUtils.computeTemplate(PAIR, [0.3, 0.7], 8)).toBe(
            "calc(0.3 * (100% - 8px)) 8px calc(0.7 * (100% - 8px))",
        );
    });

    it("clamps a bounded pane, with the whole box as the ceiling when it has no maximum", () => {
        expect(SplitPaneUtils.computeTemplate(BOUNDED, [0.3, 0.7], 8)).toBe(
            "clamp(120px, calc(0.3 * (100% - 8px)), 220px) 8px clamp(160px, calc(0.7 * (100% - 8px)), 100%)",
        );
    });
});

describe("SplitPaneUtils.computeMovedRatios", () => {
    it("trades between the two neighbors and leaves the rest alone", () => {
        const ratios = SplitPaneUtils.computeMovedRatios({
            ratios: [0.25, 0.5, 0.25],
            index: 0,
            boundary: 0.35,
            panes: [{}, {}, {}],
            availablePx: 1000,
        });

        expect(ratios[0]).toBeCloseTo(0.35);
        expect(ratios[1]).toBeCloseTo(0.4);
        expect(ratios[2]).toBe(0.25);
    });

    it("stops at a pane's pixel floor and ceiling", () => {
        const past = SplitPaneUtils.computeMovedRatios({
            ratios: [0.3, 0.7],
            index: 0,
            boundary: 1,
            panes: BOUNDED,
            availablePx: 1000,
        });

        expect(past[0], "the first pane's maximum").toBeCloseTo(0.22);

        const before = SplitPaneUtils.computeMovedRatios({
            ratios: [0.3, 0.7],
            index: 0,
            boundary: 0,
            panes: BOUNDED,
            availablePx: 1000,
        });

        expect(before[0], "the first pane's minimum").toBeCloseTo(0.12);
    });

    it("pins to the floor when the floors cannot all fit", () => {
        const limits = SplitPaneUtils.computeBoundaryLimits({
            ratios: [0.5, 0.5],
            index: 0,
            panes: [{ minPx: 250 }, { minPx: 400 }],
            availablePx: 592,
        });

        expect(limits.ceiling).toBe(limits.floor);
    });
});

describe("SplitPaneUtils.computeKeyAction", () => {
    it("reads Enter, Home and End whatever the axis", () => {
        expect(SplitPaneUtils.computeKeyAction("Enter", "vertical", "ltr")).toBe("toggle");
        expect(SplitPaneUtils.computeKeyAction("Home", "horizontal", "ltr")).toBe("home");
        expect(SplitPaneUtils.computeKeyAction("End", "horizontal", "rtl")).toBe("end");
    });

    it("takes only the arrows on its own axis, with left and right read in reading order", () => {
        expect(SplitPaneUtils.computeKeyAction("ArrowRight", "horizontal", "ltr")).toBe("increase");
        expect(SplitPaneUtils.computeKeyAction("ArrowRight", "horizontal", "rtl")).toBe("decrease");
        expect(SplitPaneUtils.computeKeyAction("ArrowDown", "vertical", "ltr")).toBe("increase");
        expect(SplitPaneUtils.computeKeyAction("ArrowRight", "vertical", "ltr")).toBeUndefined();
    });
});

describe("SplitPaneUtils.pruneCollapsed", () => {
    it("keeps a collapse only while its boundary has not moved", () => {
        const collapsed = { 0: { restore: 0.3, collapsedAt: 0 } };

        expect(SplitPaneUtils.pruneCollapsed(collapsed, [0, 1])).toEqual(collapsed);
        expect(SplitPaneUtils.pruneCollapsed(collapsed, [0.02, 0.98])).toEqual({});
    });

    it("forgets one boundary and keeps the others", () => {
        const collapsed = { 0: { restore: 0.3, collapsedAt: 0 }, 1: { restore: 0.6, collapsedAt: 0.3 } };

        expect(SplitPaneUtils.forgetCollapsed(collapsed, 0)).toEqual({ 1: { restore: 0.6, collapsedAt: 0.3 } });
    });
});
