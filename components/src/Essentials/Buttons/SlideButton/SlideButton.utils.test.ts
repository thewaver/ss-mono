import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { NavigatorDirection } from "../../../Abstracts/Navigator/Navigator.types";
import type { SlideButtonMode, SlideButtonOrientation } from "./SlideButton.types";
import { SlideButtonUtils } from "./SlideButton.utils";

const TRACK_SIZES = {
    horizontal: { width: 200, height: 40 },
    vertical: { width: 40, height: 200 },
};

const alongTrack = (
    orientation: SlideButtonOrientation,
    pointerRatio: number,
    direction: NavigatorDirection = "ltr",
) => {
    if (orientation === "vertical") return { x: 0.5, y: 1 - pointerRatio };

    return { x: direction === "rtl" ? 1 - pointerRatio : pointerRatio, y: 0.5 };
};

const createTestGesture = (
    orientation: SlideButtonOrientation,
    mode: SlideButtonMode = "both",
    completionRatio = 1,
    direction: NavigatorDirection = "ltr",
) => {
    const onActivate = vi.fn();
    let progressRatio = 0;

    const gesture = SlideButtonUtils.createGesture({
        getMode: () => mode,
        getOrientation: () => orientation,
        getDirection: () => direction,
        getThumbSize: () => 40,
        getHoldDurationMs: () => 1000,
        getCompletionRatio: () => completionRatio,
        getTrackSize: () => TRACK_SIZES[orientation],
        getProgressRatio: () => progressRatio,
        setProgressRatio: (ratio) => {
            progressRatio = ratio;
        },
        onActivate,
    });

    return { gesture, onActivate, getProgressRatio: () => progressRatio };
};

describe("computeLengthRatio", () => {
    it("expresses a length in pixels as a fraction of the track", () => {
        expect(SlideButtonUtils.computeLengthRatio(200, 40)).toBe(0.2);
    });

    it("fills the track when the length is greater than it", () => {
        expect(SlideButtonUtils.computeLengthRatio(30, 40)).toBe(1);
    });

    it("fills the track when the track has not been measured yet", () => {
        expect(SlideButtonUtils.computeLengthRatio(0, 40)).toBe(1);
    });
});

describe("computeTrackLength", () => {
    it("measures a horizontal track by its width and a vertical one by its height", () => {
        expect(SlideButtonUtils.computeTrackLength({ width: 200, height: 40 }, "horizontal")).toBe(200);
        expect(SlideButtonUtils.computeTrackLength({ width: 40, height: 200 }, "vertical")).toBe(200);
    });
});

describe("computePointerRatio", () => {
    it("counts a horizontal track from its left edge, whatever the height", () => {
        expect(SlideButtonUtils.computePointerRatio({ x: 0.25, y: 0.9 }, "horizontal", "ltr")).toBe(0.25);
    });

    it("counts a right-to-left horizontal track from its right edge", () => {
        expect(SlideButtonUtils.computePointerRatio({ x: 1, y: 0.9 }, "horizontal", "rtl")).toBe(0);
        expect(SlideButtonUtils.computePointerRatio({ x: 0.25, y: 0.9 }, "horizontal", "rtl")).toBe(0.75);
    });

    it("counts a vertical track up from its bottom edge, whatever the width or the text", () => {
        expect(SlideButtonUtils.computePointerRatio({ x: 0.9, y: 1 }, "vertical", "ltr")).toBe(0);
        expect(SlideButtonUtils.computePointerRatio({ x: 0.1, y: 0.25 }, "vertical", "ltr")).toBe(0.75);
        expect(SlideButtonUtils.computePointerRatio({ x: 0.5, y: 0 }, "vertical", "ltr")).toBe(1);
        expect(SlideButtonUtils.computePointerRatio({ x: 0.1, y: 0.25 }, "vertical", "rtl")).toBe(0.75);
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

    const createGesture = () => createTestGesture("horizontal");

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

        gesture.drag(alongTrack("horizontal", 0.1));
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

    const slideTo = (
        completionRatio: number,
        pointerRatio: number,
        orientation: SlideButtonOrientation,
        direction: NavigatorDirection,
    ) => {
        const { gesture, onActivate } = createTestGesture(orientation, "slide", completionRatio, direction);

        gesture.drag(alongTrack(orientation, 0.1, direction));
        gesture.drag(alongTrack(orientation, 0.1 + pointerRatio, direction));
        gesture.dragEnd("release");

        return onActivate;
    };

    describe.each([
        ["horizontal", "ltr"],
        ["horizontal", "rtl"],
        ["vertical", "ltr"],
        ["vertical", "rtl"],
    ] as const)("%s, %s", (orientation, direction) => {
        it("completes only at the end of the track by default", () => {
            expect(slideTo(1, 0.7, orientation, direction)).not.toHaveBeenCalled();
            expect(slideTo(1, 0.8, orientation, direction)).toHaveBeenCalledTimes(1);
        });

        it("completes part-way along when asked to, and not before", () => {
            expect(slideTo(0.5, 0.3, orientation, direction)).not.toHaveBeenCalled();
            expect(slideTo(0.5, 0.5, orientation, direction)).toHaveBeenCalledTimes(1);
        });
    });
});

describe("createGesture in a right-to-left page", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.stubGlobal("requestAnimationFrame", () => 1);
        vi.stubGlobal("cancelAnimationFrame", () => undefined);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it("picks the thumb up only where it rests, at the right", () => {
        const fromLeft = createTestGesture("horizontal", "slide", 1, "rtl");

        fromLeft.gesture.drag({ x: 0.05, y: 0.5 });
        fromLeft.gesture.drag({ x: 0.5, y: 0.5 });

        expect(fromLeft.gesture.get().isGrabbed).toBe(false);

        const fromRight = createTestGesture("horizontal", "slide", 1, "rtl");

        fromRight.gesture.drag({ x: 0.95, y: 0.5 });
        fromRight.gesture.drag({ x: 0.5, y: 0.5 });

        expect(fromRight.gesture.get().isGrabbed).toBe(true);
        expect(fromRight.getProgressRatio()).toBeGreaterThan(0);
    });

    it("does nothing when the thumb is carried rightward", () => {
        const { gesture, onActivate, getProgressRatio } = createTestGesture("horizontal", "slide", 1, "rtl");

        gesture.drag({ x: 0.85, y: 0.5 });
        gesture.drag({ x: 1, y: 0.5 });

        expect(getProgressRatio()).toBe(0);

        gesture.dragEnd("release");

        expect(onActivate).not.toHaveBeenCalled();
    });
});

describe("createGesture along a vertical track", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.stubGlobal("requestAnimationFrame", () => 1);
        vi.stubGlobal("cancelAnimationFrame", () => undefined);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it("picks the thumb up only where it rests, at the bottom", () => {
        const fromTop = createTestGesture("vertical", "slide");

        fromTop.gesture.drag(alongTrack("vertical", 0.95));
        fromTop.gesture.drag(alongTrack("vertical", 0.5));

        expect(fromTop.gesture.get().isGrabbed).toBe(false);

        const fromBottom = createTestGesture("vertical", "slide");

        fromBottom.gesture.drag(alongTrack("vertical", 0.1));
        fromBottom.gesture.drag(alongTrack("vertical", 0.5));

        expect(fromBottom.gesture.get().isGrabbed).toBe(true);
        expect(fromBottom.getProgressRatio()).toBeGreaterThan(0);
    });

    it("does nothing when the thumb is carried downward", () => {
        const { gesture, onActivate, getProgressRatio } = createTestGesture("vertical", "slide");

        gesture.drag({ x: 0.5, y: 0.8 });
        gesture.drag({ x: 0.5, y: 1 });

        expect(getProgressRatio()).toBe(0);

        gesture.dragEnd("release");

        expect(onActivate).not.toHaveBeenCalled();
    });

    it("takes a sideways wobble on the thumb as no travel", () => {
        const { gesture } = createTestGesture("vertical", "slide");

        gesture.drag({ x: 0.1, y: 0.95 });
        gesture.drag({ x: 0.9, y: 0.95 });

        expect(gesture.get().isGrabbed).toBe(false);
    });

    it("still confirms on a held Enter, whatever the axis", () => {
        const { gesture, onActivate } = createTestGesture("vertical", "slide");

        gesture.pressKey("Enter", false);

        expect(gesture.get().isHolding).toBe(true);

        gesture.click();

        expect(onActivate).not.toHaveBeenCalled();
    });

    it("activates on a bare click, as on a horizontal track", () => {
        const { gesture, onActivate } = createTestGesture("vertical");

        gesture.click();

        expect(onActivate).toHaveBeenCalledTimes(1);
    });
});
