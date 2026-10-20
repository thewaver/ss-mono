import { describe, expect, it } from "vitest";

import { type Span, SpanUtils } from "../../src/Abstracts/span.js";

const RANGE: Span = { start: 0, end: 100 };

const span = (start: number, end: number): Span => ({ start, end });

describe("SpanUtils.clamp", () => {
    it("keeps the span inside the range and never wider than it", () => {
        expect(SpanUtils.clamp(span(-50, 300), RANGE, 1)).toEqual(span(0, 100));
    });

    it("slides a span that ran off the end back against it rather than shrinking it", () => {
        expect(SpanUtils.clamp(span(90, 130), RANGE, 1)).toEqual(span(60, 100));
    });

    it("holds the smallest span a consumer asked for", () => {
        expect(SpanUtils.clamp(span(50, 50.1), RANGE, 10)).toEqual(span(50, 60));
    });
});

describe("SpanUtils.zoom", () => {
    it("leaves the value under the focus where it was", () => {
        const zoomed = SpanUtils.zoom(span(0, 100), 0.5, 0.25, RANGE, 1);

        expect(zoomed, "a quarter across 0..100 is 25, and it is a quarter across the new span too").toEqual(
            span(12.5, 62.5),
        );
    });

    it("cannot zoom out past the range", () => {
        expect(SpanUtils.zoom(span(20, 40), 100, 0.5, RANGE, 1)).toEqual(span(0, 100));
    });

    it("cannot zoom in past the smallest span", () => {
        expect(SpanUtils.zoom(span(0, 100), 0.001, 0.5, RANGE, 20)).toEqual(span(40, 60));
    });
});

describe("SpanUtils.pan", () => {
    it("moves by a share of what is on screen", () => {
        expect(SpanUtils.pan(span(20, 40), 0.5, RANGE)).toEqual(span(30, 50));
    });

    it("stops at the end of the range with the span the width it was", () => {
        expect(SpanUtils.pan(span(80, 100), 0.5, RANGE)).toEqual(span(80, 100));
    });
});

describe("SpanUtils.reveal", () => {
    it("does nothing when the target is already on screen", () => {
        expect(SpanUtils.reveal(span(25, 30), span(20, 40), RANGE)).toEqual(span(20, 40));
    });

    it("moves the least it can to bring a target in from the right", () => {
        expect(SpanUtils.reveal(span(45, 50), span(20, 40), RANGE)).toEqual(span(30, 50));
    });

    it("puts a target that is wider than the span against the left edge", () => {
        expect(SpanUtils.reveal(span(50, 90), span(20, 40), RANGE)).toEqual(span(50, 70));
    });
});

describe("SpanUtils.packLanes", () => {
    it("gives overlapping spans their own lane and re-uses a lane once it is free", () => {
        expect(SpanUtils.packLanes([span(0, 10), span(5, 20), span(30, 40), span(12, 18)])).toEqual([0, 1, 0, 0]);
    });

    it("lets a span that starts exactly where the last one ended share its lane", () => {
        expect(SpanUtils.packLanes([span(0, 10), span(10, 20)])).toEqual([0, 0]);
    });

    it("stacks a pile of spans covering the same moment into one lane each", () => {
        expect(SpanUtils.packLanes([span(0, 10), span(1, 11), span(2, 12)])).toEqual([0, 1, 2]);
    });
});

describe("SpanUtils.chooseTickSteps", () => {
    it("picks the smallest step that still leaves the gap the consumer asked for", () => {
        expect(SpanUtils.chooseTickSteps(1000, 500, 50, [1, 10, 50, 100, 500])).toEqual({ step: 100, majorStep: 500 });
    });

    it("marks with the nearest step that divides, rather than inventing one the ladder does not have", () => {
        expect(
            SpanUtils.chooseTickSteps(180, 460, 72, [1, 5, 15, 30, 60]),
            "a minute is only twice the chosen half minute, but it is the round number a reader expects",
        ).toEqual({ step: 30, majorStep: 60 });
    });

    it("labels every tick when the ladder has nothing bigger that would fit on screen", () => {
        expect(
            SpanUtils.chooseTickSteps(180, 380, 72, [1, 5, 15, 30, 60]),
            "an axis with one label on it is worse than an axis with a label on every tick",
        ).toEqual({ step: 60, majorStep: 60 });
    });

    it("falls back to the widest step in the ladder when even that is too fine", () => {
        expect(SpanUtils.chooseTickSteps(100000, 100, 50, [1, 10, 100]).step).toBe(100);
    });

    it("counts in ones, twos and fives when no ladder is given", () => {
        expect(SpanUtils.chooseTickSteps(100, 500, 50, undefined)).toEqual({ step: 10, majorStep: 50 });
        expect(SpanUtils.chooseTickSteps(300, 500, 50, undefined)).toEqual({ step: 50, majorStep: 200 });
    });

    it("reads a step in the consumer's own unit rather than in pixels", () => {
        const minute = 60000;
        const ladder = [1000, 15000, minute, 5 * minute, 15 * minute, 60 * minute];

        expect(SpanUtils.chooseTickSteps(60 * minute, 600, 30, ladder)).toEqual({
            step: 5 * minute,
            majorStep: 15 * minute,
        });
    });
});

describe("SpanUtils.getTicks", () => {
    it("lands on the multiples of the step that fall inside the window", () => {
        const ticks = SpanUtils.getTicks(span(12, 40), { step: 10, majorStep: 50 });

        expect(ticks.map((tick) => tick.value)).toEqual([20, 30, 40]);
    });

    it("places each tick as a share of the window", () => {
        const ticks = SpanUtils.getTicks(span(0, 100), { step: 25, majorStep: 100 });

        expect(ticks.map((tick) => tick.ratio)).toEqual([0, 0.25, 0.5, 0.75, 1]);
    });

    it("marks the multiples of the bigger step, and only those", () => {
        const ticks = SpanUtils.getTicks(span(0, 100), { step: 25, majorStep: 100 });

        expect(ticks.filter((tick) => tick.isMajor).map((tick) => tick.value)).toEqual([0, 100]);
    });

    it("says nothing rather than looping forever on a window with no width", () => {
        expect(SpanUtils.getTicks(span(10, 10), { step: 1, majorStep: 5 })).toEqual([]);
    });
});
