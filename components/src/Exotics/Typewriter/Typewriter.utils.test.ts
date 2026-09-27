import { describe, expect, it } from "vitest";

import { TypewriterUtils } from "./Typewriter.utils";

describe("indexSegments", () => {
    it("counts a run of text by character and an image or a break as one", () => {
        const { segments, count } = TypewriterUtils.indexSegments([
            { type: "text", text: "ab", metrics: {}, nonMetrics: {}, meta: { common: { dataset: {}, title: "" } } },
            { type: "linebreak" },
            { type: "text", text: "😀c", metrics: {}, nonMetrics: {}, meta: { common: { dataset: {}, title: "" } } },
        ]);

        expect(segments.map((segment) => segment.startIndex)).toEqual([0, 2, 3]);
        expect(count).toBe(5);
    });
});

describe("computeStartTimes", () => {
    it("spreads the run over the count times the delay, left to right by default", () => {
        expect(TypewriterUtils.computeStartTimes(3, undefined, false, 100, 10)).toEqual([100, 115, 130]);
    });

    it("runs the order backwards while erasing", () => {
        expect(TypewriterUtils.computeStartTimes(3, undefined, true, 0, 10)).toEqual([30, 15, 0]);
    });
});

describe("the caret", () => {
    it("starts before the first character typing and after the last erasing, and rests at the other end", () => {
        expect(TypewriterUtils.getFirstCaretIndex(false, 4)).toBe(-1);
        expect(TypewriterUtils.getFirstCaretIndex(true, 4)).toBe(3);
        expect(TypewriterUtils.getLastCaretIndex(false, 4)).toBe(3);
        expect(TypewriterUtils.getLastCaretIndex(true, 4)).toBe(-1);
    });

    it("follows a character as it arrives, and sits before one as it leaves", () => {
        expect(TypewriterUtils.getCaretIndexOnStart(false, 2)).toBe(2);
        expect(TypewriterUtils.getCaretIndexOnStart(true, 2)).toBe(1);
    });
});

describe("getIsResetSkipped", () => {
    it("always plays the first run", () => {
        expect(TypewriterUtils.getIsResetSkipped(false, "content", false, false)).toBe(false);
    });

    it("skips a later run only for a cause whose reset was turned off", () => {
        expect(TypewriterUtils.getIsResetSkipped(true, "content", false, undefined)).toBe(true);
        expect(TypewriterUtils.getIsResetSkipped(true, "layout", false, undefined)).toBe(false);
        expect(TypewriterUtils.getIsResetSkipped(true, "layout", undefined, false)).toBe(true);
        expect(TypewriterUtils.getIsResetSkipped(true, "other", false, false)).toBe(false);
    });
});
