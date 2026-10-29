import { describe, expect, it } from "vitest";

import { SliceAnimationBreakpoints } from "./SliceAnimationBreakpoints.const";
import type { SliceAnimationBreakpointTriple, SliceAnimationEasing } from "./SliceAnimationBreakpoints.types";
import { SliceAnimationBreakpointUtils } from "./SliceAnimationBreakpoints.utils";

describe("SliceAnimationBreakpointUtils", () => {
    it("puts a heavy cell at the start of the timeline and a light one at the end", () => {
        expect(SliceAnimationBreakpointUtils.computeBreakpoints(1)).toEqual([0, 0.125, 0.25]);
        expect(SliceAnimationBreakpointUtils.computeBreakpoints(0)).toEqual([0.75, 0.875, 1]);
    });

    it("reverses that with a descending direction", () => {
        expect(SliceAnimationBreakpointUtils.computeBreakpoints(1, { dir: "desc" })).toEqual([0.75, 0.875, 1]);
        expect(SliceAnimationBreakpointUtils.computeBreakpoints(0, { dir: "desc" })).toEqual([0, 0.125, 0.25]);
    });

    it("collapses to an instant at zero smoothness and spans the whole timeline at one", () => {
        expect(SliceAnimationBreakpointUtils.computeBreakpoints(0.5, { smoothness: 0 })).toEqual([0.5, 0.5, 0.5]);
        expect(SliceAnimationBreakpointUtils.computeBreakpoints(0.5, { smoothness: 1 })).toEqual([0, 0.5, 1]);
    });

    it("clamps a weight and a smoothness that are out of range rather than producing a broken window", () => {
        expect(SliceAnimationBreakpointUtils.computeBreakpoints(5)).toEqual([0, 0.125, 0.25]);
        expect(SliceAnimationBreakpointUtils.computeBreakpoints(-5)).toEqual([0.75, 0.875, 1]);
        expect(SliceAnimationBreakpointUtils.computeBreakpoints(0.5, { smoothness: 9 })).toEqual([0, 0.5, 1]);
    });

    it("maps the global timeline onto a cell's own window", () => {
        const window: SliceAnimationBreakpointTriple = [0.75, 0.875, 1];

        expect(SliceAnimationBreakpointUtils.computeLocalTimeline(window, 0.5)).toBe(0);
        expect(SliceAnimationBreakpointUtils.computeLocalTimeline(window, 0.75)).toBe(0);
        expect(SliceAnimationBreakpointUtils.computeLocalTimeline(window, 0.875)).toBe(0.5);
        expect(SliceAnimationBreakpointUtils.computeLocalTimeline(window, 1)).toBe(1);
        expect(SliceAnimationBreakpointUtils.computeLocalTimeline(window, 2)).toBe(1);
    });

    it("leaves the mapping alone when the easing is linear, which is the default", () => {
        const window: SliceAnimationBreakpointTriple = [0, 0.5, 1];

        for (const timeline of [0, 0.25, 0.5, 0.75, 1]) {
            expect(SliceAnimationBreakpointUtils.computeLocalTimeline(window, timeline, "linear")).toBe(timeline);
            expect(SliceAnimationBreakpointUtils.computeLocalTimeline(window, timeline)).toBe(timeline);
        }
    });

    it("holds both ends of the window whatever the easing, so a cell still starts and finishes where it did", () => {
        const window: SliceAnimationBreakpointTriple = [0, 0.5, 1];

        for (const easing of SliceAnimationBreakpoints.EASINGS) {
            expect(SliceAnimationBreakpointUtils.computeLocalTimeline(window, 0, easing)).toBeCloseTo(0, 5);
            expect(SliceAnimationBreakpointUtils.computeLocalTimeline(window, 1, easing)).toBeCloseTo(1, 5);
        }
    });

    it("puts the middle of an eased window off center, in the direction the easing names", () => {
        const window: SliceAnimationBreakpointTriple = [0, 0.5, 1];
        const halfway = (easing: SliceAnimationEasing) =>
            SliceAnimationBreakpointUtils.computeLocalTimeline(window, 0.5, easing);

        expect(halfway("ease-in"), "a slow start is behind halfway at halfway").toBeLessThan(0.5);
        expect(halfway("ease-out"), "a slow finish is ahead of it").toBeGreaterThan(0.5);
        expect(halfway("ease-in-out"), "and a symmetric curve is back on it").toBeCloseTo(0.5, 5);
    });

    it("stays monotonic across the window, so nothing plays backwards mid-cell", () => {
        const window: SliceAnimationBreakpointTriple = [0, 0.5, 1];

        for (const easing of SliceAnimationBreakpoints.EASINGS) {
            let previous = -1;

            for (let step = 0; step <= 100; step++) {
                const value = SliceAnimationBreakpointUtils.computeLocalTimeline(window, step / 100, easing);

                expect(value, `${easing} went backwards at ${step / 100}`).toBeGreaterThanOrEqual(previous);

                previous = value;
            }
        }
    });

    it("eases inside the cell's own window rather than the whole timeline", () => {
        const window: SliceAnimationBreakpointTriple = [0.5, 0.75, 1];

        expect(SliceAnimationBreakpointUtils.computeLocalTimeline(window, 0.5, "ease-in")).toBeCloseTo(0, 5);
        expect(SliceAnimationBreakpointUtils.computeLocalTimeline(window, 0.75, "ease-in")).toBeCloseTo(
            SliceAnimationBreakpointUtils.computeLocalTimeline([0, 0.5, 1], 0.5, "ease-in"),
            5,
        );
    });

    it("switches instantly when the window has no width, rather than dividing by zero", () => {
        const instant: SliceAnimationBreakpointTriple = [0.5, 0.5, 0.5];

        expect(SliceAnimationBreakpointUtils.computeLocalTimeline(instant, 0.49)).toBe(0);
        expect(SliceAnimationBreakpointUtils.computeLocalTimeline(instant, 0.5)).toBe(1);
    });
});
