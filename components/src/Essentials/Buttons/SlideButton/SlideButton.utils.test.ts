import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SlideButtonUtils } from "./SlideButton.utils";

describe("computeWidthRatio", () => {
    it("expresses a width in pixels as a fraction of the track", () => {
        expect(SlideButtonUtils.computeWidthRatio(200, 40)).toBe(0.2);
    });

    it("fills the track when the width is greater than it", () => {
        expect(SlideButtonUtils.computeWidthRatio(30, 40)).toBe(1);
    });

    it("fills the track when the track has not been measured yet", () => {
        expect(SlideButtonUtils.computeWidthRatio(0, 40)).toBe(1);
    });
});

describe("computeIsOnThumb", () => {
    it("accepts a press anywhere across the resting thumb", () => {
        expect(SlideButtonUtils.computeIsOnThumb(0, 0, 0.2)).toBe(true);
        expect(SlideButtonUtils.computeIsOnThumb(0.2, 0, 0.2)).toBe(true);
    });

    it("refuses a press on the empty track beyond it", () => {
        expect(SlideButtonUtils.computeIsOnThumb(0.5, 0, 0.2)).toBe(false);
    });

    it("follows the thumb once it has traveled", () => {
        expect(SlideButtonUtils.computeIsOnThumb(0.5, 0.5, 0.2)).toBe(true);
        expect(SlideButtonUtils.computeIsOnThumb(0, 0.5, 0.2)).toBe(false);
    });
});

describe("computeProgressRatio", () => {
    it("subtracts where the thumb was grabbed, so the thumb does not jump under the pointer", () => {
        expect(SlideButtonUtils.computeProgressRatio(0.2, 0.2, 0.2)).toBe(0);
        expect(SlideButtonUtils.computeProgressRatio(0.6, 0.2, 0.2)).toBeCloseTo(0.5);
    });

    it("reaches the end when the pointer carries the grabbed point to it", () => {
        expect(SlideButtonUtils.computeProgressRatio(1, 0.2, 0.2)).toBe(1);
    });

    it("clamps rather than overshooting at either end", () => {
        expect(SlideButtonUtils.computeProgressRatio(2, 0.1, 0.2)).toBe(1);
        expect(SlideButtonUtils.computeProgressRatio(-1, 0.1, 0.2)).toBe(0);
    });

    it("reports no progress when a thumb as wide as its track has nowhere to go", () => {
        expect(SlideButtonUtils.computeProgressRatio(0.5, 0, 1)).toBe(0);
    });
});

describe("computeHoldRatio", () => {
    it("runs the hold from nothing to complete over its duration", () => {
        expect(SlideButtonUtils.computeHoldRatio(0, 1000)).toBe(0);
        expect(SlideButtonUtils.computeHoldRatio(250, 1000)).toBe(0.25);
        expect(SlideButtonUtils.computeHoldRatio(1000, 1000)).toBe(1);
    });

    it("stays complete rather than running past the end", () => {
        expect(SlideButtonUtils.computeHoldRatio(4000, 1000)).toBe(1);
    });

    it("completes at once when no duration was asked for", () => {
        expect(SlideButtonUtils.computeHoldRatio(0, 0)).toBe(1);
    });
});

describe("createGesture click", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.stubGlobal("requestAnimationFrame", () => 1);
        vi.stubGlobal("cancelAnimationFrame", () => undefined);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    const createGesture = () => {
        const onActivate = vi.fn();
        let progressRatio = 0;

        const gesture = SlideButtonUtils.createGesture({
            getMode: () => "both",
            getThumbSize: () => 40,
            getHoldDurationMs: () => 1000,
            getCompletionRatio: () => 1,
            getTrackWidth: () => 200,
            getProgressRatio: () => progressRatio,
            setProgressRatio: (ratio) => {
                progressRatio = ratio;
            },
            onActivate,
        });

        return { gesture, onActivate };
    };

    it("activates on a click with no press behind it, as assistive technology sends one", () => {
        const { gesture, onActivate } = createGesture();

        gesture.click();

        expect(onActivate).toHaveBeenCalledTimes(1);
    });

    it("ignores the click a key press produces, held or let go", () => {
        const { gesture, onActivate } = createGesture();

        gesture.pressKey("Enter", false);
        gesture.click();
        gesture.pressKey("Enter", true);
        gesture.click();
        gesture.releaseKey("Enter");
        gesture.click();

        expect(onActivate).not.toHaveBeenCalled();
    });

    it("ignores the click a pointer press produces, tapped or slid", () => {
        const { gesture, onActivate } = createGesture();

        gesture.drag(0.1);
        gesture.dragEnd("release");
        gesture.click();

        expect(onActivate).not.toHaveBeenCalled();
    });

    it("takes a bare click again once the press before it has ended", () => {
        const { gesture, onActivate } = createGesture();

        gesture.pressKey(" ", false);
        gesture.releaseKey(" ");
        vi.runAllTimers();
        gesture.click();

        expect(onActivate).toHaveBeenCalledTimes(1);
    });
});

describe("computeCompletionRatio", () => {
    it("passes a share within the track through", () => {
        expect(SlideButtonUtils.computeCompletionRatio(0.8)).toBe(0.8);
        expect(SlideButtonUtils.computeCompletionRatio(1)).toBe(1);
    });

    it("asks for no more than the end of the track", () => {
        expect(SlideButtonUtils.computeCompletionRatio(3)).toBe(1);
    });

    it("never completes a thumb that has barely moved", () => {
        expect(SlideButtonUtils.computeCompletionRatio(0)).toBeGreaterThan(0);
        expect(SlideButtonUtils.computeCompletionRatio(-1)).toBeGreaterThan(0);
    });
});

describe("createGesture completion", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.stubGlobal("requestAnimationFrame", () => 1);
        vi.stubGlobal("cancelAnimationFrame", () => undefined);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    const slideTo = (completionRatio: number, pointerRatio: number) => {
        const onActivate = vi.fn();
        let progressRatio = 0;

        const gesture = SlideButtonUtils.createGesture({
            getMode: () => "slide",
            getThumbSize: () => 40,
            getHoldDurationMs: () => 1000,
            getCompletionRatio: () => completionRatio,
            getTrackWidth: () => 200,
            getProgressRatio: () => progressRatio,
            setProgressRatio: (ratio) => {
                progressRatio = ratio;
            },
            onActivate,
        });

        gesture.drag(0.1);
        gesture.drag(0.1 + pointerRatio);
        gesture.dragEnd("release");

        return onActivate;
    };

    it("completes only at the end of the track by default", () => {
        expect(slideTo(1, 0.7)).not.toHaveBeenCalled();
        expect(slideTo(1, 0.8)).toHaveBeenCalledTimes(1);
    });

    it("completes part-way along when asked to, and not before", () => {
        expect(slideTo(0.5, 0.3)).not.toHaveBeenCalled();
        expect(slideTo(0.5, 0.5)).toHaveBeenCalledTimes(1);
    });
});
