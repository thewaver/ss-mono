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
