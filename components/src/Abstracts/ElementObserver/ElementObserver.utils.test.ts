import { describe, expect, it } from "vitest";

import { ElementObserverUtils } from "./ElementObserver.utils";

describe("computeCurrentIndex", () => {
    it("is the last entry whose top has passed the line", () => {
        expect(ElementObserverUtils.computeCurrentIndex([-400, -100, 50, 600], 120)).toBe(2);
        expect(ElementObserverUtils.computeCurrentIndex([-400, -100, 300, 600], 120)).toBe(1);
    });

    it("counts a top sitting exactly on the line as passed", () => {
        expect(ElementObserverUtils.computeCurrentIndex([0, 120, 400], 120)).toBe(1);
    });

    it("is nothing while no entry has reached the line", () => {
        expect(ElementObserverUtils.computeCurrentIndex([200, 500], 120)).toBeUndefined();
        expect(ElementObserverUtils.computeCurrentIndex([], 120)).toBeUndefined();
    });

    it("never picks a missing entry, and keeps the others in place", () => {
        expect(ElementObserverUtils.computeCurrentIndex([-50, undefined, 400], 120)).toBe(0);
        expect(ElementObserverUtils.computeCurrentIndex([-50, undefined, 100], 120)).toBe(2);
    });
});

describe("computeViewportProgress", () => {
    it("is nothing while the element has yet to come up past the bottom edge", () => {
        expect(ElementObserverUtils.computeViewportProgress(800, 200, 800)).toBe(0);
        expect(ElementObserverUtils.computeViewportProgress(1200, 200, 800)).toBe(0);
    });

    it("is everything once the element's bottom has gone past the top edge", () => {
        expect(ElementObserverUtils.computeViewportProgress(-200, 200, 800)).toBe(1);
        expect(ElementObserverUtils.computeViewportProgress(-900, 200, 800)).toBe(1);
    });

    it("runs in a straight line between the two", () => {
        expect(ElementObserverUtils.computeViewportProgress(300, 200, 800)).toBe(0.5);
        expect(ElementObserverUtils.computeViewportProgress(550, 200, 800)).toBe(0.25);
    });

    it("is nothing when there is no height to travel through", () => {
        expect(ElementObserverUtils.computeViewportProgress(0, 0, 0)).toBe(0);
    });
});
