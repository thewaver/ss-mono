import { describe, expect, it } from "vitest";

import type { TimelineSpan } from "./Timeline.types";
import { TimelineUtils } from "./Timeline.utils";

const RANGE: TimelineSpan = { start: 0, end: 100 };

const span = (start: number, end: number): TimelineSpan => ({ start, end });

const SPANS = [span(0, 10), span(5, 20), span(30, 40), span(12, 18)];

const lanesOf = (spans: TimelineSpan[]) => TimelineUtils.packLanes(spans);

const stopsOf = (spans: TimelineSpan[], disabled: number[] = []) => {
    const lanes = lanesOf(spans);
    const order = TimelineUtils.computeOrder(spans, lanes);

    return TimelineUtils.computeStops(
        spans,
        lanes,
        order,
        spans.map((_unused, index) => disabled.includes(index)),
    );
};

describe("clampView", () => {
    it("keeps the window inside the range and never wider than it", () => {
        expect(TimelineUtils.clampView(span(-50, 300), RANGE, 1)).toEqual(span(0, 100));
    });

    it("slides a window that ran off the end back against it rather than shrinking it", () => {
        expect(TimelineUtils.clampView(span(90, 130), RANGE, 1)).toEqual(span(60, 100));
    });

    it("holds the smallest window a consumer asked for", () => {
        expect(TimelineUtils.clampView(span(50, 50.1), RANGE, 10)).toEqual(span(50, 60));
    });
});

describe("zoomView", () => {
    it("leaves the value under the focus where it was", () => {
        const zoomed = TimelineUtils.zoomView(span(0, 100), 0.5, 0.25, RANGE, 1);

        expect(zoomed, "a quarter across 0..100 is 25, and it is a quarter across the new window too").toEqual(
            span(12.5, 62.5),
        );
    });

    it("cannot zoom out past the range", () => {
        expect(TimelineUtils.zoomView(span(20, 40), 100, 0.5, RANGE, 1)).toEqual(span(0, 100));
    });

    it("cannot zoom in past the smallest window", () => {
        expect(TimelineUtils.zoomView(span(0, 100), 0.001, 0.5, RANGE, 20)).toEqual(span(40, 60));
    });
});

describe("panView", () => {
    it("moves by a share of what is on screen", () => {
        expect(TimelineUtils.panView(span(20, 40), 0.5, RANGE)).toEqual(span(30, 50));
    });

    it("stops at the end of the range with the window the width it was", () => {
        expect(TimelineUtils.panView(span(80, 100), 0.5, RANGE)).toEqual(span(80, 100));
    });
});

describe("revealView", () => {
    it("does nothing when the span is already on screen", () => {
        expect(TimelineUtils.revealView(span(25, 30), span(20, 40), RANGE)).toEqual(span(20, 40));
    });

    it("moves the least it can to bring a span in from the right", () => {
        expect(TimelineUtils.revealView(span(45, 50), span(20, 40), RANGE)).toEqual(span(30, 50));
    });

    it("puts a span that is wider than the window against the left edge", () => {
        expect(TimelineUtils.revealView(span(50, 90), span(20, 40), RANGE)).toEqual(span(50, 70));
    });
});

describe("packLanes", () => {
    it("gives overlapping spans their own lane and re-uses a lane once it is free", () => {
        expect(lanesOf(SPANS)).toEqual([0, 1, 0, 0]);
    });

    it("lets a span that starts exactly where the last one ended share its lane", () => {
        expect(lanesOf([span(0, 10), span(10, 20)])).toEqual([0, 0]);
    });

    it("stacks a pile of spans covering the same moment into one lane each", () => {
        expect(lanesOf([span(0, 10), span(1, 11), span(2, 12)])).toEqual([0, 1, 2]);
    });
});

describe("computePlacements", () => {
    it("places every span in time order, with its edges as shares of the window", () => {
        const lanes = lanesOf(SPANS);
        const order = TimelineUtils.computeOrder(SPANS, lanes);
        const placements = TimelineUtils.computePlacements(SPANS, lanes, order, span(0, 20));

        expect(placements.map((placement) => placement.index)).toEqual([0, 1, 3, 2]);
        expect(placements[1]).toEqual({
            index: 1,
            order: 1,
            lane: 1,
            startRatio: 0.25,
            endRatio: 1,
            isInView: true,
        });
    });

    it("says which spans the window can show, rather than leaving them out", () => {
        const lanes = lanesOf(SPANS);
        const order = TimelineUtils.computeOrder(SPANS, lanes);
        const placements = TimelineUtils.computePlacements(SPANS, lanes, order, span(0, 20));

        expect(
            placements.filter((placement) => !placement.isInView).map((placement) => placement.index),
            "the span at 30..40 is the one off screen",
        ).toEqual([2]);
    });

    it("keeps a span that straddles an edge, with a share outside 0..1 to say so", () => {
        const placements = TimelineUtils.computePlacements([span(0, 10)], [0], [0], span(5, 15));

        expect(placements[0].startRatio).toBe(-0.5);
        expect(placements[0].isInView).toBe(true);
    });
});

describe("computeStepIndex", () => {
    it("walks in time order rather than in the order the consumer listed them", () => {
        const stops = stopsOf(SPANS);

        expect(stops.map((stop) => stop.index)).toEqual([0, 1, 3, 2]);
        expect(TimelineUtils.computeStepIndex("next", 1, stops)).toBe(3);
        expect(TimelineUtils.computeStepIndex("previous", 3, stops)).toBe(1);
    });

    it("stops at the ends rather than wrapping", () => {
        const stops = stopsOf(SPANS);

        expect(TimelineUtils.computeStepIndex("previous", 0, stops)).toBeUndefined();
        expect(TimelineUtils.computeStepIndex("next", 2, stops)).toBeUndefined();
    });

    it("skips a disabled span entirely", () => {
        const stops = stopsOf(SPANS, [1]);

        expect(TimelineUtils.computeStepIndex("next", 0, stops)).toBe(3);
    });

    it("crosses to the nearest lane and then to the nearest start in it", () => {
        const stops = stopsOf(SPANS);

        expect(TimelineUtils.computeStepIndex("laneAfter", 0, stops)).toBe(1);
        expect(TimelineUtils.computeStepIndex("laneBefore", 1, stops)).toBe(0);
    });

    it("has nowhere to go from the outermost lane", () => {
        const stops = stopsOf(SPANS);

        expect(TimelineUtils.computeStepIndex("laneBefore", 0, stops)).toBeUndefined();
    });

    it("jumps to the ends", () => {
        const stops = stopsOf(SPANS);

        expect(TimelineUtils.computeStepIndex("first", 2, stops)).toBe(0);
        expect(TimelineUtils.computeStepIndex("last", 0, stops)).toBe(2);
    });
});

describe("chooseSteps", () => {
    it("picks the smallest step that still leaves the gap the consumer asked for", () => {
        expect(TimelineUtils.chooseSteps(1000, 500, 50, [1, 10, 50, 100, 500])).toEqual({ step: 100, majorStep: 500 });
    });

    it("marks with the nearest step that divides, rather than inventing one the ladder does not have", () => {
        expect(
            TimelineUtils.chooseSteps(180, 460, 72, [1, 5, 15, 30, 60]),
            "a minute is only twice the chosen half minute, but it is the round number a reader expects",
        ).toEqual({ step: 30, majorStep: 60 });
    });

    it("labels every tick when the ladder has nothing bigger that would fit on screen", () => {
        expect(
            TimelineUtils.chooseSteps(180, 380, 72, [1, 5, 15, 30, 60]),
            "an axis with one label on it is worse than an axis with a label on every tick",
        ).toEqual({ step: 60, majorStep: 60 });
    });

    it("falls back to the widest step in the ladder when even that is too fine", () => {
        expect(TimelineUtils.chooseSteps(100000, 100, 50, [1, 10, 100]).step).toBe(100);
    });

    it("counts in ones, twos and fives when no ladder is given", () => {
        expect(TimelineUtils.chooseSteps(100, 500, 50, undefined)).toEqual({ step: 10, majorStep: 50 });
        expect(TimelineUtils.chooseSteps(300, 500, 50, undefined)).toEqual({ step: 50, majorStep: 200 });
    });

    it("reads a step in the consumer's own unit rather than in pixels", () => {
        const minute = 60000;
        const ladder = [1000, 15000, minute, 5 * minute, 15 * minute, 60 * minute];

        expect(TimelineUtils.chooseSteps(60 * minute, 600, 30, ladder)).toEqual({
            step: 5 * minute,
            majorStep: 15 * minute,
        });
    });
});

describe("computeTicks", () => {
    it("lands on the multiples of the step that fall inside the window", () => {
        const ticks = TimelineUtils.computeTicks(span(12, 40), { step: 10, majorStep: 50 });

        expect(ticks.map((tick) => tick.value)).toEqual([20, 30, 40]);
    });

    it("places each tick as a share of the window", () => {
        const ticks = TimelineUtils.computeTicks(span(0, 100), { step: 25, majorStep: 100 });

        expect(ticks.map((tick) => tick.ratio)).toEqual([0, 0.25, 0.5, 0.75, 1]);
    });

    it("marks the multiples of the bigger step, and only those", () => {
        const ticks = TimelineUtils.computeTicks(span(0, 100), { step: 25, majorStep: 100 });

        expect(ticks.filter((tick) => tick.isMajor).map((tick) => tick.value)).toEqual([0, 100]);
    });

    it("says nothing rather than looping forever on a window with no width", () => {
        expect(TimelineUtils.computeTicks(span(10, 10), { step: 1, majorStep: 5 })).toEqual([]);
    });
});

describe("computeMarkers", () => {
    it("places each marker as a share of the view and says whether it is on screen", () => {
        expect(TimelineUtils.computeMarkers([25, 50, 80], span(20, 70))).toEqual([
            { value: 25, ratio: 0.1, isInView: true },
            { value: 50, ratio: 0.6, isInView: true },
            { value: 80, ratio: 1.2, isInView: false },
        ]);
    });

    it("counts a marker on either edge of the view as in view", () => {
        const markers = TimelineUtils.computeMarkers([20, 70], span(20, 70));

        expect(markers.map((marker) => marker.isInView)).toEqual([true, true]);
    });
});

describe("moveEdge", () => {
    it("moves only the edge it was asked to", () => {
        expect(TimelineUtils.moveEdge(span(10, 20), "end", 35, RANGE)).toEqual(span(10, 35));
        expect(TimelineUtils.moveEdge(span(10, 20), "start", 4, RANGE)).toEqual(span(4, 20));
    });

    it("stops an edge at the other one rather than turning the span inside out", () => {
        expect(TimelineUtils.moveEdge(span(10, 20), "end", 2, RANGE)).toEqual(span(10, 10));
        expect(TimelineUtils.moveEdge(span(10, 20), "start", 50, RANGE)).toEqual(span(20, 20));
    });

    it("keeps the edge inside the range", () => {
        expect(TimelineUtils.moveEdge(span(10, 20), "end", 400, RANGE)).toEqual(span(10, 100));
        expect(TimelineUtils.moveEdge(span(10, 20), "start", -5, RANGE)).toEqual(span(0, 20));
    });
});

describe("computeSteppedEdgeValue", () => {
    const toWhole = (value: number) => Math.round(value);
    const toTens = (value: number) => Math.round(value / 10) * 10;

    it("moves one step either way when nothing snaps", () => {
        expect(TimelineUtils.computeSteppedEdgeValue(40, 1, 5, RANGE)).toBe(45);
        expect(TimelineUtils.computeSteppedEdgeValue(40, -1, 5, RANGE)).toBe(35);
    });

    it("lands on the very next snapped value when the snap is finer than the step", () => {
        expect(TimelineUtils.computeSteppedEdgeValue(40.4, 1, 30, RANGE, toWhole)).toBe(41);
        expect(TimelineUtils.computeSteppedEdgeValue(40.4, -1, 30, RANGE, toWhole)).toBe(40);
        expect(TimelineUtils.computeSteppedEdgeValue(40, 1, 30, RANGE, toWhole)).toBe(41);
    });

    it("keeps stepping until a coarser snap gives a new value, so every press moves one notch", () => {
        expect(TimelineUtils.computeSteppedEdgeValue(40, 1, 1, RANGE, toTens)).toBe(50);
        expect(TimelineUtils.computeSteppedEdgeValue(40, -1, 1, RANGE, toTens)).toBe(30);
    });

    it("stops at the ends of the range, and stays put when it is already there", () => {
        expect(TimelineUtils.computeSteppedEdgeValue(98, 1, 5, RANGE)).toBe(100);
        expect(TimelineUtils.computeSteppedEdgeValue(100, 1, 1, RANGE, toTens)).toBe(100);
        expect(TimelineUtils.computeSteppedEdgeValue(0, -1, 1, RANGE, toTens)).toBe(0);
    });

    it("moves nothing for a step of nothing", () => {
        expect(TimelineUtils.computeSteppedEdgeValue(40, 1, 0, RANGE, toTens)).toBe(40);
    });
});

describe("computeKeyAction", () => {
    const resting = { isHolding: false, isEditable: false };
    const editable = { isHolding: false, isEditable: true };
    const holding = { isHolding: true, isEditable: true };

    it("walks with the arrows, Home and End while nothing is held", () => {
        expect(TimelineUtils.computeKeyAction("ArrowRight", resting)).toEqual({ kind: "step", step: "next" });
        expect(TimelineUtils.computeKeyAction("ArrowUp", resting)).toEqual({ kind: "step", step: "laneBefore" });
        expect(TimelineUtils.computeKeyAction("End", resting)).toEqual({ kind: "step", step: "last" });
    });

    it("takes hold with Enter only while edges are on, and Space still activates", () => {
        expect(TimelineUtils.computeKeyAction("Enter", resting)).toEqual({ kind: "activate" });
        expect(TimelineUtils.computeKeyAction("Enter", editable)).toEqual({ kind: "hold" });
        expect(TimelineUtils.computeKeyAction(" ", editable)).toEqual({ kind: "activate" });
    });

    it("moves the held edge, switches ends, drops and cancels while holding, and never walks away", () => {
        expect(TimelineUtils.computeKeyAction("ArrowLeft", holding)).toEqual({
            kind: "aim",
            edge: undefined,
            nudge: -1,
        });
        expect(TimelineUtils.computeKeyAction("Home", holding)).toEqual({
            kind: "aim",
            edge: "start",
            nudge: undefined,
        });
        expect(TimelineUtils.computeKeyAction("Enter", holding)).toEqual({ kind: "drop" });
        expect(TimelineUtils.computeKeyAction("Escape", holding)).toEqual({ kind: "cancel" });
        expect(TimelineUtils.computeKeyAction("ArrowDown", holding)).toEqual({ kind: "ignore" });
    });

    it("leaves Tab and anything else alone", () => {
        expect(TimelineUtils.computeKeyAction("Tab", holding)).toBeUndefined();
        expect(TimelineUtils.computeKeyAction("a", resting)).toBeUndefined();
    });
});

describe("computeItemBox", () => {
    it("places an item as a share of the view across and by its lane down", () => {
        const placement = { ...TimelineUtils.getBlankPlacement(0), startRatio: 0.25, endRatio: 0.5, lane: 2 };

        expect(TimelineUtils.computeItemBox(placement, 20, 40, 4)).toEqual({
            left: 25,
            width: 25,
            top: 108,
            height: 40,
        });
    });

    it("counts lanes and height with no gap after the last lane", () => {
        expect(TimelineUtils.computeLaneCount([0, 2, 1])).toBe(3);
        expect(TimelineUtils.computeLaneCount([])).toBe(1);
        expect(TimelineUtils.computeHeight(20, 3, 40, 4)).toBe(148);
    });
});

describe("computeRovingIndex", () => {
    it("keeps the item last focused while it is still a stop, and falls back to the first", () => {
        const stops = stopsOf(SPANS, [1]);

        expect(TimelineUtils.computeRovingIndex(stops, 2)).toBe(2);
        expect(TimelineUtils.computeRovingIndex(stops, 1)).toBe(stops[0].index);
        expect(TimelineUtils.computeRovingIndex([], 1)).toBeUndefined();
    });

    it("builds what is in view plus the roving item", () => {
        const placements = TimelineUtils.computePlacements(
            SPANS,
            lanesOf(SPANS),
            TimelineUtils.computeOrder(SPANS, lanesOf(SPANS)),
            span(0, 11),
        );

        expect(TimelineUtils.computeRenderedIndices(placements, 2)).toEqual([0, 1, 2]);
    });
});

describe("computePointerRatio", () => {
    it("reads a pointer as a share of the box, and the middle when there is no box", () => {
        expect(TimelineUtils.computePointerRatio(150, { left: 100, width: 200 })).toBe(0.25);
        expect(TimelineUtils.computePointerRatio(150, undefined)).toBe(0.5);
    });
});

describe("computeShownSpans", () => {
    it("draws the held item at its proposed span and leaves the list alone otherwise", () => {
        expect(TimelineUtils.computeShownSpans(SPANS, 1, span(5, 25))[1]).toEqual(span(5, 25));
        expect(TimelineUtils.computeShownSpans(SPANS, undefined, span(5, 25))).toBe(SPANS);
    });
});
