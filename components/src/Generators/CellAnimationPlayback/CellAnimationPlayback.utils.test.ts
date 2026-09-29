import { describe, expect, it } from "vitest";

import { CellAnimationBreakpointUtils } from "../CellAnimationBreakpoints/CellAnimationBreakpoints.utils";
import type { CellAnimationPlaybackDirection } from "./CellAnimationPlayback.types";
import { CellAnimationPlaybackUtils } from "./CellAnimationPlayback.utils";

describe("CellAnimationPlaybackUtils", () => {
    it("leaves a one-way pass at the length it was given, whichever way round it runs", () => {
        expect(CellAnimationPlaybackUtils.computeCycleDurationMs(2000)).toBe(2000);
        expect(CellAnimationPlaybackUtils.computeCycleDurationMs(2000, { dir: "normal", holdMs: 500 })).toBe(2000);
        expect(CellAnimationPlaybackUtils.computeCycleDurationMs(2000, { dir: "reverse", holdMs: 500 })).toBe(2000);
    });

    it("charges a round trip for both trips plus the hold between them", () => {
        expect(CellAnimationPlaybackUtils.computeCycleDurationMs(2000, { dir: "stack" })).toBe(4000);
        expect(CellAnimationPlaybackUtils.computeCycleDurationMs(2000, { dir: "stack", holdMs: 1000 })).toBe(5000);
        expect(
            CellAnimationPlaybackUtils.computeCycleDurationMs(2000, { dir: "stack-reverse", holdMs: 1000 }),
        ).toBe(5000);
        expect(CellAnimationPlaybackUtils.computeCycleDurationMs(2000, { dir: "stack", holdMs: -1000 })).toBe(4000);
    });

    it("runs a normal pass forwards and a reverse one backwards", () => {
        for (const timeline of [0, 0.25, 0.5, 0.75, 1]) {
            expect(CellAnimationPlaybackUtils.computeGlobalTimeline(timeline, 2000)).toBe(timeline);
            expect(CellAnimationPlaybackUtils.computeGlobalTimeline(timeline, 2000, { dir: "reverse" })).toBe(
                1 - timeline,
            );
        }
    });

    it("spends the first half of a round trip going out and the second coming back", () => {
        const at = (timeline: number) =>
            CellAnimationPlaybackUtils.computeGlobalTimeline(timeline, 2000, { dir: "stack" });

        expect(at(0)).toBe(0);
        expect(at(0.25)).toBe(0.5);
        expect(at(0.5)).toBe(1);
        expect(at(0.75)).toBe(0.5);
        expect(at(1)).toBe(0);
    });

    it("parks at the far end for exactly the hold's share of the cycle", () => {
        const at = (timeline: number) =>
            CellAnimationPlaybackUtils.computeGlobalTimeline(timeline, 2000, { dir: "stack", holdMs: 1000 });

        expect(at(0)).toBeCloseTo(0, 5);
        expect(at(0.2)).toBeCloseTo(0.5, 5);
        expect(at(0.4)).toBeCloseTo(1, 5);
        expect(at(0.5)).toBeCloseTo(1, 5);
        expect(at(0.6)).toBeCloseTo(1, 5);
        expect(at(0.8)).toBeCloseTo(0.5, 5);
        expect(at(1)).toBeCloseTo(0, 5);
    });

    it("starts a stack-reverse pass at the far end and holds there instead", () => {
        const at = (timeline: number) =>
            CellAnimationPlaybackUtils.computeGlobalTimeline(timeline, 2000, {
                dir: "stack-reverse",
                holdMs: 1000,
            });

        expect(at(0)).toBeCloseTo(1, 5);
        expect(at(0.2)).toBeCloseTo(0.5, 5);
        expect(at(0.4)).toBeCloseTo(0, 5);
        expect(at(0.6)).toBeCloseTo(0, 5);
        expect(at(0.8)).toBeCloseTo(0.5, 5);
        expect(at(1)).toBeCloseTo(1, 5);
    });

    it("ends a round trip where it started, so the next one joins onto it", () => {
        for (const holdMs of [0, 500, 5000]) {
            for (const dir of ["stack", "stack-reverse", "pipe", "pipe-reverse"] as const) {
                const first = CellAnimationPlaybackUtils.computeGlobalTimeline(0, 2000, { dir, holdMs });
                const last = CellAnimationPlaybackUtils.computeGlobalTimeline(1, 2000, { dir, holdMs });

                expect(last, `${dir} at a ${holdMs}ms hold`).toBeCloseTo(first, 5);
            }
        }
    });

    it("holds at the far end throughout rather than dividing by zero, when there is no trip to make", () => {
        expect(CellAnimationPlaybackUtils.computeGlobalTimeline(0, 0, { dir: "stack", holdMs: 1000 })).toBe(1);
        expect(CellAnimationPlaybackUtils.computeGlobalTimeline(1, 0, { dir: "stack", holdMs: 1000 })).toBe(1);
    });

    it("counts stack and pipe as round trips and the one-way directions as not", () => {
        expect(CellAnimationPlaybackUtils.isRoundTrip()).toBe(false);
        expect(CellAnimationPlaybackUtils.isRoundTrip("normal")).toBe(false);
        expect(CellAnimationPlaybackUtils.isRoundTrip("reverse")).toBe(false);

        for (const dir of ["stack", "stack-reverse", "pipe", "pipe-reverse"] as const) {
            expect(CellAnimationPlaybackUtils.isRoundTrip(dir), dir).toBe(true);
        }
    });

    it("runs a pipe's timeline exactly as a stack's", () => {
        for (const timeline of [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1]) {
            expect(CellAnimationPlaybackUtils.computeGlobalTimeline(timeline, 2000, { dir: "pipe", holdMs: 500 })).toBe(
                CellAnimationPlaybackUtils.computeGlobalTimeline(timeline, 2000, { dir: "stack", holdMs: 500 }),
            );
            expect(
                CellAnimationPlaybackUtils.computeGlobalTimeline(timeline, 2000, { dir: "pipe-reverse", holdMs: 500 }),
            ).toBe(
                CellAnimationPlaybackUtils.computeGlobalTimeline(timeline, 2000, { dir: "stack-reverse", holdMs: 500 }),
            );
        }
    });

    it("flips the breakpoint direction only while a pipe is coming back", () => {
        const opts = { dir: "asc", smoothness: 0.4, easing: "ease-in" } as const;
        const at = (timeline: number, dir: CellAnimationPlaybackDirection) =>
            CellAnimationPlaybackUtils.computeBreakpointOpts(opts, timeline, { dir })?.dir;

        expect(at(0.25, "pipe")).toBe("asc");
        expect(at(0.75, "pipe")).toBe("desc");
        expect(at(0.25, "pipe-reverse")).toBe("desc");
        expect(at(0.75, "pipe-reverse")).toBe("asc");

        for (const dir of ["normal", "reverse", "stack", "stack-reverse"] as const) {
            expect(CellAnimationPlaybackUtils.computeBreakpointOpts(opts, 0.75, { dir }), dir).toBe(opts);
        }

        expect(CellAnimationPlaybackUtils.computeBreakpointOpts({}, 0.75, { dir: "pipe" }).dir).toBe("desc");
    });

    describe("played through the breakpoints, with a heavy cell and a light one", () => {
        const DURATION_MS = 1000;
        const HOLD_MS = 500;
        const BREAKPOINT_OPTS = { smoothness: 0.4, easing: "ease-in" } as const;

        const progressOf = (weight: number, timeline: number, dir: CellAnimationPlaybackDirection) => {
            const playback = { dir, holdMs: HOLD_MS };
            const breakpointOpts = CellAnimationPlaybackUtils.computeBreakpointOpts(BREAKPOINT_OPTS, timeline, playback);

            return CellAnimationBreakpointUtils.computeLocalTimeline(
                CellAnimationBreakpointUtils.computeBreakpoints(weight, breakpointOpts),
                CellAnimationPlaybackUtils.computeGlobalTimeline(timeline, DURATION_MS, playback),
                breakpointOpts.easing,
            );
        };
        const cycleMs = DURATION_MS * 2 + HOLD_MS;
        const outwardAt = (legShare: number) => (legShare * DURATION_MS) / cycleMs;
        const returnAt = (legShare: number) => (DURATION_MS + HOLD_MS + legShare * DURATION_MS) / cycleMs;

        it("sends the cell that arrived first home last under stack, and first under pipe", () => {
            expect(progressOf(1, outwardAt(0.3), "stack"), "the heavy cell leads the way out").toBeGreaterThan(
                progressOf(0, outwardAt(0.3), "stack"),
            );
            expect(progressOf(1, returnAt(0.3), "stack"), "and under stack is still out when the light one leaves").toBe(
                1,
            );
            expect(progressOf(0, returnAt(0.3), "stack")).toBeLessThan(1);
            expect(progressOf(1, returnAt(0.3), "pipe"), "under pipe it leaves first").toBeLessThan(1);
            expect(progressOf(0, returnAt(0.3), "pipe")).toBe(1);
        });

        it("sends the cell leading the way home under pipe back exactly as the one leading it under stack, easing included", () => {
            for (const weight of [0, 0.25, 1]) {
                for (const legShare of [0.1, 0.35, 0.6, 0.85]) {
                    expect(progressOf(weight, returnAt(legShare), "pipe"), `${weight} at ${legShare}`).toBeCloseTo(
                        progressOf(1 - weight, returnAt(legShare), "stack"),
                        5,
                    );
                }
            }
        });

        it("starts a pipe-reverse with every cell out, and the heavy cell leads both ways", () => {
            expect(progressOf(1, 0, "pipe-reverse")).toBe(1);
            expect(progressOf(0, 0, "pipe-reverse")).toBe(1);
            expect(progressOf(1, outwardAt(0.3), "pipe-reverse"), "first to leave").toBeLessThan(
                progressOf(0, outwardAt(0.3), "pipe-reverse"),
            );
            expect(progressOf(1, returnAt(0.3), "pipe-reverse"), "and first to come back").toBeGreaterThan(
                progressOf(0, returnAt(0.3), "pipe-reverse"),
            );
        });
    });
});
