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
