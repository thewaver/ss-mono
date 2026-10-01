import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Toast } from "./Toasts.types";
import { ToastUtils } from "./Toasts.utils";

const toast = (id: string): Toast<string> => ({ id, value: id });

const FIVE = ["a", "b", "c", "d", "e"].map(toast);

describe("computeStackAlignment", () => {
    it("maps a corner onto both flex axes for a plain column", () => {
        expect(ToastUtils.computeStackAlignment("bottom-right", "column")).toEqual({
            justifyContent: "flex-end",
            alignItems: "flex-end",
        });
    });

    it("keeps the same corner when the column is reversed, by flipping the main axis alone", () => {
        expect(ToastUtils.computeStackAlignment("bottom-right", "column-reverse")).toEqual({
            justifyContent: "flex-start",
            alignItems: "flex-end",
        });
    });

    it("swaps which axis each half of the alignment drives for a row", () => {
        expect(ToastUtils.computeStackAlignment("top-center", "row")).toEqual({
            justifyContent: "center",
            alignItems: "flex-start",
        });
    });

    it("leaves a centered main axis alone when reversed, since center has no opposite", () => {
        expect(ToastUtils.computeStackAlignment("top-center", "row-reverse")).toEqual({
            justifyContent: "center",
            alignItems: "flex-start",
        });
    });

    it("flips the horizontal half for a reversed row", () => {
        expect(ToastUtils.computeStackAlignment("bottom-left", "row-reverse")).toEqual({
            justifyContent: "flex-end",
            alignItems: "flex-end",
        });
    });

    it("reads middle and center as the same edge on whichever axis they land", () => {
        expect(ToastUtils.computeStackAlignment("middle-left", "column")).toEqual({
            justifyContent: "center",
            alignItems: "flex-start",
        });
        expect(ToastUtils.computeStackAlignment("middle-center", "row")).toEqual({
            justifyContent: "center",
            alignItems: "center",
        });
    });
});

describe("computeSwipeDirection", () => {
    it("sends a toast off the side it sits against, corners included", () => {
        expect(ToastUtils.computeSwipeDirection("bottom-right")).toBe("right");
        expect(ToastUtils.computeSwipeDirection("top-left")).toBe("left");
        expect(ToastUtils.computeSwipeDirection("middle-right")).toBe("right");
    });

    it("sends a toast centered along the top or bottom off that edge", () => {
        expect(ToastUtils.computeSwipeDirection("top-center")).toBe("up");
        expect(ToastUtils.computeSwipeDirection("bottom-center")).toBe("down");
    });

    it("has no way off for a stack in the middle of the screen", () => {
        expect(ToastUtils.computeSwipeDirection("middle-center")).toBeUndefined();
    });
});

describe("computeSwipeAxis", () => {
    it("follows the swipe's direction, and falls back to across when there is none", () => {
        expect(ToastUtils.computeSwipeAxis("down")).toBe("vertical");
        expect(ToastUtils.computeSwipeAxis("right")).toBe("horizontal");
        expect(ToastUtils.computeSwipeAxis(undefined)).toBe("horizontal");
    });
});

describe("computeAdmitted", () => {
    it("admits everything without a limit, or within it", () => {
        expect(ToastUtils.computeAdmitted(FIVE, undefined, "dismiss-oldest")).toBe(FIVE);
        expect(ToastUtils.computeAdmitted(FIVE, 5, "dismiss-oldest")).toBe(FIVE);
    });

    it("admits the newest when the oldest are to be dismissed, and the oldest when the newest wait", () => {
        expect(ToastUtils.computeAdmitted(FIVE, 3, "dismiss-oldest").map((entry) => entry.id)).toEqual(["c", "d", "e"]);
        expect(ToastUtils.computeAdmitted(FIVE, 3, "hold-newest").map((entry) => entry.id)).toEqual(["a", "b", "c"]);
    });
});

describe("computeOverflowTrim", () => {
    it("writes the oldest out past the limit", () => {
        expect(ToastUtils.computeOverflowTrim(FIVE, 3, "dismiss-oldest")?.map((entry) => entry.id)).toEqual([
            "c",
            "d",
            "e",
        ]);
    });

    it("trims nothing within the limit, without one, or when the newest wait", () => {
        expect(ToastUtils.computeOverflowTrim(FIVE, 5, "dismiss-oldest")).toBeUndefined();
        expect(ToastUtils.computeOverflowTrim(FIVE, undefined, "dismiss-oldest")).toBeUndefined();
        expect(ToastUtils.computeOverflowTrim(FIVE, 3, "hold-newest")).toBeUndefined();
    });
});

describe("withoutToast", () => {
    it("takes one toast out", () => {
        expect(ToastUtils.withoutToast(FIVE, "b").map((entry) => entry.id)).toEqual(["a", "c", "d", "e"]);
    });

    it("answers the same list for a toast that is not there, so a second dismissal writes nothing", () => {
        expect(ToastUtils.withoutToast(FIVE, "z")).toBe(FIVE);
    });
});

describe("computeEntryIds", () => {
    it("appends new arrivals and keeps a leaving toast in its place", () => {
        expect(ToastUtils.computeEntryIds(["x", "a"], FIVE.slice(0, 2))).toEqual(["x", "a", "b"]);
    });

    it("answers the same list when nothing arrived", () => {
        const entryIds = ["a", "b"];

        expect(ToastUtils.computeEntryIds(entryIds, FIVE.slice(0, 2))).toBe(entryIds);
    });
});

describe("createCountdown", () => {
    const DURATION_MS = 4_000;

    beforeEach(() => {
        vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "performance"] });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("elapses after the duration", () => {
        const onElapse = vi.fn();

        ToastUtils.createCountdown().run(DURATION_MS, false, onElapse);

        vi.advanceTimersByTime(DURATION_MS - 1);
        expect(onElapse).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        expect(onElapse).toHaveBeenCalledTimes(1);
    });

    it("runs no clock while held", () => {
        const onElapse = vi.fn();

        expect(ToastUtils.createCountdown().run(DURATION_MS, true, onElapse)).toBeUndefined();

        vi.advanceTimersByTime(DURATION_MS * 2);
        expect(onElapse).not.toHaveBeenCalled();
    });

    it("gives a toast held half way through its remaining half, not a fresh duration", () => {
        const countdown = ToastUtils.createCountdown();
        const onElapse = vi.fn();

        const stop = countdown.run(DURATION_MS, false, onElapse);

        vi.advanceTimersByTime(DURATION_MS * 0.5);
        stop?.();

        countdown.run(DURATION_MS, true, onElapse);
        vi.advanceTimersByTime(DURATION_MS * 2);

        countdown.run(DURATION_MS, false, onElapse);
        vi.advanceTimersByTime(DURATION_MS * 0.5);

        expect(onElapse).toHaveBeenCalledTimes(1);
    });

    it("starts again from a changed duration", () => {
        const countdown = ToastUtils.createCountdown();
        const onElapse = vi.fn();

        countdown.run(DURATION_MS, false, onElapse)?.();
        countdown.run(DURATION_MS * 2, false, onElapse);

        vi.advanceTimersByTime(DURATION_MS * 2 - 1);
        expect(onElapse).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        expect(onElapse).toHaveBeenCalledTimes(1);
    });
});
