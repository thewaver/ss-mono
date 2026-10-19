import { describe, expect, it } from "vitest";

import type { PanZoomBounds, PanZoomSpan, PanZoomView } from "./PanZoom.types";
import { PanZoomUtils } from "./PanZoom.utils";

const RANGE: PanZoomSpan = { start: 0, end: 100 };

const span = (start: number, end: number): PanZoomSpan => ({ start, end });

const view = (left: number, top: number, right: number, bottom: number): PanZoomView => ({
    x: span(left, right),
    y: span(top, bottom),
});

const BOUNDS: PanZoomBounds = { range: view(0, 0, 200, 100), aspect: 0.5, minWidth: 20 };

describe("clampSpan", () => {
    it("keeps the span inside the range and never wider than it", () => {
        expect(PanZoomUtils.clampSpan(span(-50, 300), RANGE, 1)).toEqual(span(0, 100));
    });

    it("slides a span that ran off the end back against it rather than shrinking it", () => {
        expect(PanZoomUtils.clampSpan(span(90, 130), RANGE, 1)).toEqual(span(60, 100));
    });

    it("holds the smallest span a consumer asked for", () => {
        expect(PanZoomUtils.clampSpan(span(50, 50.1), RANGE, 10)).toEqual(span(50, 60));
    });
});

describe("zoomSpan", () => {
    it("leaves the value under the focus where it was", () => {
        const zoomed = PanZoomUtils.zoomSpan(span(0, 100), 0.5, 0.25, RANGE, 1);

        expect(zoomed, "a quarter across 0..100 is 25, and it is a quarter across the new span too").toEqual(
            span(12.5, 62.5),
        );
    });

    it("cannot zoom out past the range", () => {
        expect(PanZoomUtils.zoomSpan(span(20, 40), 100, 0.5, RANGE, 1)).toEqual(span(0, 100));
    });

    it("cannot zoom in past the smallest span", () => {
        expect(PanZoomUtils.zoomSpan(span(0, 100), 0.001, 0.5, RANGE, 20)).toEqual(span(40, 60));
    });
});

describe("panSpan", () => {
    it("moves by a share of what is on screen", () => {
        expect(PanZoomUtils.panSpan(span(20, 40), 0.5, RANGE)).toEqual(span(30, 50));
    });

    it("stops at the end of the range with the span the width it was", () => {
        expect(PanZoomUtils.panSpan(span(80, 100), 0.5, RANGE)).toEqual(span(80, 100));
    });
});

describe("revealSpan", () => {
    it("does nothing when the target is already on screen", () => {
        expect(PanZoomUtils.revealSpan(span(25, 30), span(20, 40), RANGE)).toEqual(span(20, 40));
    });

    it("moves the least it can to bring a target in from the right", () => {
        expect(PanZoomUtils.revealSpan(span(45, 50), span(20, 40), RANGE)).toEqual(span(30, 50));
    });

    it("puts a target that is wider than the span against the left edge", () => {
        expect(PanZoomUtils.revealSpan(span(50, 90), span(20, 40), RANGE)).toEqual(span(50, 70));
    });
});

describe("fitView", () => {
    it("deepens a view that is wider than the window's shape, about its middle", () => {
        expect(PanZoomUtils.fitView(view(0, 40, 100, 60), 0.5)).toEqual(view(0, 25, 100, 75));
    });

    it("widens a view that is deeper than the window's shape, about its middle", () => {
        expect(PanZoomUtils.fitView(view(40, 0, 60, 50), 0.5)).toEqual(view(0, 0, 100, 50));
    });
});

describe("clampView", () => {
    it("gives the view the window's shape before anything else", () => {
        expect(PanZoomUtils.clampView(view(50, 25, 150, 35), BOUNDS)).toEqual(view(50, 5, 150, 55));
    });

    it("slides a view that ran off the range back inside it", () => {
        expect(PanZoomUtils.clampView(view(180, 80, 220, 100), BOUNDS)).toEqual(view(160, 80, 200, 100));
    });

    it("never shows more than the whole range, and centers the range the way there is room to spare", () => {
        expect(PanZoomUtils.clampView(view(0, 0, 400, 200), { ...BOUNDS, aspect: 1 })).toEqual(view(0, -50, 200, 150));
    });

    it("holds the narrowest view allowed, about the view's middle", () => {
        expect(PanZoomUtils.clampView(view(95, 49, 105, 54), BOUNDS)).toEqual(view(90, 46.5, 110, 56.5));
    });

    it("leaves the view alone while the window has no shape yet", () => {
        expect(PanZoomUtils.clampView(view(1, 2, 3, 4), { ...BOUNDS, aspect: 0 })).toEqual(view(1, 2, 3, 4));
    });
});

describe("zoomView", () => {
    it("leaves what is under the focus where it was, both ways", () => {
        const zoomed = PanZoomUtils.zoomView(view(0, 0, 200, 100), 0.5, { x: 0.25, y: 0.5 }, BOUNDS);

        expect(zoomed).toEqual(view(25, 25, 125, 75));
    });

    it("cannot zoom out past the whole range", () => {
        expect(PanZoomUtils.zoomView(view(40, 20, 80, 40), 100, { x: 0.5, y: 0.5 }, BOUNDS)).toEqual(
            view(0, 0, 200, 100),
        );
    });

    it("cannot zoom in past the narrowest view", () => {
        expect(PanZoomUtils.zoomView(view(0, 0, 200, 100), 0.001, { x: 0.5, y: 0.5 }, BOUNDS)).toEqual(
            view(90, 45, 110, 55),
        );
    });
});

describe("panView", () => {
    it("moves by a share of what is on screen, each way on its own", () => {
        expect(PanZoomUtils.panView(view(40, 20, 80, 40), { x: 0.5, y: -0.5 }, BOUNDS)).toEqual(view(60, 10, 100, 30));
    });

    it("stops at the edge of the range with the view the size it was", () => {
        expect(PanZoomUtils.panView(view(160, 80, 200, 100), { x: 1, y: 1 }, BOUNDS)).toEqual(view(160, 80, 200, 100));
    });
});

describe("revealView", () => {
    it("does nothing when the area is already in view", () => {
        expect(PanZoomUtils.revealView(view(50, 25, 60, 30), view(40, 20, 80, 40), BOUNDS)).toEqual(
            view(40, 20, 80, 40),
        );
    });

    it("moves the least it can, each way, to bring an area in", () => {
        expect(PanZoomUtils.revealView(view(90, 45, 95, 50), view(40, 20, 80, 40), BOUNDS)).toEqual(
            view(55, 30, 95, 50),
        );
    });
});

describe("lerpView", () => {
    it("is part of the way between the two, every edge alike", () => {
        expect(PanZoomUtils.lerpView(view(0, 0, 100, 50), view(100, 50, 200, 100), 0.25)).toEqual(
            view(25, 12.5, 125, 62.5),
        );
    });
});

describe("computePointerRatio", () => {
    it("reads the pointer as a share across and down the window", () => {
        expect(
            PanZoomUtils.computePointerRatio({ x: 150, y: 75 }, { left: 100, top: 50, width: 200, height: 100 }),
        ).toEqual({ x: 0.25, y: 0.25 });
    });

    it("reads the middle when the window has not been measured", () => {
        expect(PanZoomUtils.computePointerRatio({ x: 1, y: 2 }, undefined)).toEqual({ x: 0.5, y: 0.5 });
    });
});

describe("computeOverlapRatio", () => {
    it("is 1 for the same area and 0 for areas that do not meet", () => {
        expect(PanZoomUtils.computeOverlapRatio(view(0, 0, 10, 10), view(0, 0, 10, 10))).toBe(1);
        expect(PanZoomUtils.computeOverlapRatio(view(0, 0, 10, 10), view(20, 20, 30, 30))).toBe(0);
    });

    it("is what the two share against what they cover between them", () => {
        expect(PanZoomUtils.computeOverlapRatio(view(0, 0, 10, 10), view(5, 0, 15, 10))).toBeCloseTo(50 / 150);
    });
});

describe("clampView with edges that may be centered", () => {
    it("lets the view travel until an edge of the range sits in its middle, and no further", () => {
        expect(PanZoomUtils.clampView(view(180, 40, 260, 80), { ...BOUNDS, canCenterEdges: true })).toEqual(
            view(160, 40, 240, 80),
        );
    });
});
