import { describe, expect, it } from "vitest";

import { type Span, SpanUtils } from "@thewaver/ss-utils";

import { TimelineUtils } from "./Timeline.utils";

const RANGE: Span = { start: 0, end: 100 };

const span = (start: number, end: number): Span => ({ start, end });

const SPANS = [span(0, 10), span(5, 20), span(30, 40), span(12, 18)];

const lanesOf = (spans: Span[]) => SpanUtils.packLanes(spans);

const stopsOf = (spans: Span[], disabled: number[] = []) => {
    const lanes = lanesOf(spans);
    const order = TimelineUtils.computeOrder(spans, lanes);

    return TimelineUtils.computeStops(
        spans,
        lanes,
        order,
        spans.map((_unused, index) => disabled.includes(index)),
    );
};

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

        expect(TimelineUtils.computeStepIndex("lane_after", 0, stops)).toBe(1);
        expect(TimelineUtils.computeStepIndex("lane_before", 1, stops)).toBe(0);
    });

    it("has nowhere to go from the outermost lane", () => {
        const stops = stopsOf(SPANS);

        expect(TimelineUtils.computeStepIndex("lane_before", 0, stops)).toBeUndefined();
    });

    it("jumps to the ends", () => {
        const stops = stopsOf(SPANS);

        expect(TimelineUtils.computeStepIndex("first", 2, stops)).toBe(0);
        expect(TimelineUtils.computeStepIndex("last", 0, stops)).toBe(2);
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
        expect(TimelineUtils.computeKeyAction("ArrowUp", resting)).toEqual({ kind: "step", step: "lane_before" });
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

describe("computeShownSpans", () => {
    it("draws the held item at its proposed span and leaves the list alone otherwise", () => {
        expect(TimelineUtils.computeShownSpans(SPANS, 1, span(5, 25))[1]).toEqual(span(5, 25));
        expect(TimelineUtils.computeShownSpans(SPANS, undefined, span(5, 25))).toBe(SPANS);
    });
});
