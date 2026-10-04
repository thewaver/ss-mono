import { describe, expect, it } from "vitest";

import { TypewriterUtils } from "./Typewriter.utils";

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

describe("computeCaretIndex", () => {
    const START_TIMES = [0, 10, 20];

    it("sits at the run's first place before any character has started", () => {
        expect(TypewriterUtils.computeCaretIndex(START_TIMES, -5, false, false)).toBe(-1);
        expect(TypewriterUtils.computeCaretIndex([20, 10, 0], -5, true, false)).toBe(2);
    });

    it("follows the character that started most recently", () => {
        expect(TypewriterUtils.computeCaretIndex(START_TIMES, 15, false, false)).toBe(1);
        expect(TypewriterUtils.computeCaretIndex([0, 30, 10], 20, false, false)).toBe(2);
    });

    it("sits before the character that most recently started leaving", () => {
        expect(TypewriterUtils.computeCaretIndex([20, 10, 0], 15, true, false)).toBe(0);
    });

    it("rests at the run's last place once it is over, whatever the time says", () => {
        expect(TypewriterUtils.computeCaretIndex(START_TIMES, 0, false, true)).toBe(2);
        expect(TypewriterUtils.computeCaretIndex(START_TIMES, 0, true, true)).toBe(-1);
    });
});

describe("getIsRunning", () => {
    it("holds the letters from the beginning up to, but not at, the end of a played run", () => {
        expect(TypewriterUtils.getIsRunning(3, 0, true)).toBe(true);
        expect(TypewriterUtils.getIsRunning(3, 0.99, true)).toBe(true);
        expect(TypewriterUtils.getIsRunning(3, 1, true)).toBe(false);
    });

    it("keeps holding them at the end while the progress is driven from outside", () => {
        expect(TypewriterUtils.getIsRunning(3, 1, false)).toBe(true);
    });

    it("never holds anything with nothing to type", () => {
        expect(TypewriterUtils.getIsRunning(0, 0.5, false)).toBe(false);
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
