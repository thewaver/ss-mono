import { describe, expect, it } from "vitest";

import type { Span } from "@thewaver/ss-utils";

import type { PanZoomBounds, PanZoomView } from "./PanZoom.types";
import { PanZoomUtils } from "./PanZoom.utils";

const span = (start: number, end: number): Span => ({ start, end });

const view = (left: number, top: number, right: number, bottom: number): PanZoomView => ({
    x: span(left, right),
    y: span(top, bottom),
});

const BOUNDS: PanZoomBounds = { range: view(0, 0, 200, 100), aspect: 0.5, minWidth: 20 };

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
