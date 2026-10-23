import { describe, expect, it } from "vitest";

import { ScrollerUtils } from "./Scroller.utils";

describe("ScrollerUtils.getSteps", () => {
    it("splits the buttons, or puts both on one side", () => {
        expect(ScrollerUtils.getSteps("split", true)).toEqual({ leading: ["previous"], trailing: ["next"] });
        expect(ScrollerUtils.getSteps("start", true)).toEqual({ leading: ["previous", "next"], trailing: [] });
        expect(ScrollerUtils.getSteps("end", true)).toEqual({ leading: [], trailing: ["previous", "next"] });
    });

    it("renders none when there is nothing to scroll", () => {
        expect(ScrollerUtils.getSteps("split", false)).toEqual({ leading: [], trailing: [] });
    });
});

describe("ScrollerUtils reading the ends", () => {
    it("counts a pixel from either end as arrived", () => {
        expect(ScrollerUtils.getIsAtStart({ start: 1, visible: 100, total: 300 })).toBe(true);
        expect(ScrollerUtils.getIsAtStart({ start: 2, visible: 100, total: 300 })).toBe(false);
        expect(ScrollerUtils.getIsAtEnd({ start: 199, visible: 100, total: 300 })).toBe(true);
        expect(ScrollerUtils.getIsAtEnd({ start: 150, visible: 100, total: 300 })).toBe(false);
    });

    it("is scrollable only when the content overruns by more than a pixel", () => {
        expect(ScrollerUtils.getIsScrollable({ start: 0, visible: 100, total: 101 })).toBe(false);
        expect(ScrollerUtils.getIsScrollable({ start: 0, visible: 100, total: 102 })).toBe(true);
    });
});

describe("ScrollerUtils.computeProgressRatio", () => {
    it("is the position over the distance there is to travel", () => {
        expect(ScrollerUtils.computeProgressRatio({ start: 50, visible: 100, total: 300 })).toBe(0.25);
    });

    it("is zero when nothing overflows", () => {
        expect(ScrollerUtils.computeProgressRatio({ start: 0, visible: 100, total: 80 })).toBe(0);
    });
});

describe("ScrollerUtils.computeStepLanding", () => {
    const ITEMS = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    const VISIBLE = 350;

    it("lands on the furthest item start within the next view, and the nearest within the previous", () => {
        expect(ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "next", 0)).toBe(300);
        expect(ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "previous", 700)).toBe(400);
    });

    it("keeps one more item of the view just left for each of overlap, going forward", () => {
        expect(ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "next", 0, 1)).toBe(200);
        expect(ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "next", 0, 2)).toBe(100);
    });

    it("keeps one more item of the view just left for each of overlap, going back", () => {
        expect(ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "previous", 700, 1)).toBe(500);
        expect(ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "previous", 700, 2)).toBe(600);
    });

    it("still moves by one item however much overlap is asked for", () => {
        expect(ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "next", 0, 50)).toBe(100);
        expect(ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "previous", 700, 50)).toBe(600);
    });

    it("treats a negative, fractional or unreadable overlap as a whole number from zero", () => {
        const plain = ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "next", 0);

        expect(ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "next", 0, -3)).toBe(plain);
        expect(ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "next", 0, 0.9)).toBe(plain);
        expect(ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "next", 0, Number.NaN)).toBe(plain);
        expect(ScrollerUtils.computeStepLanding(ITEMS, VISIBLE, "next", 0, 1.9)).toBe(200);
    });

    it("goes a full view where there is no item start inside it, whatever the overlap", () => {
        expect(ScrollerUtils.computeStepLanding([0], VISIBLE, "next", 0, 2)).toBe(VISIBLE);
        expect(ScrollerUtils.computeStepLanding([0], VISIBLE, "previous", 500, 2)).toBe(150);
    });
});
