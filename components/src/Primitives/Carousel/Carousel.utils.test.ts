import { describe, expect, it } from "vitest";

import { CarouselUtils } from "./Carousel.utils";

describe("wrapIndex", () => {
    it("leaves an index inside the range alone", () => {
        expect(CarouselUtils.wrapIndex(2, 5)).toBe(2);
    });

    it("wraps past the end round to the start", () => {
        expect(CarouselUtils.wrapIndex(5, 5)).toBe(0);
        expect(CarouselUtils.wrapIndex(7, 5)).toBe(2);
    });

    it("wraps below the start round to the end, which the remainder operator alone does not", () => {
        expect(CarouselUtils.wrapIndex(-1, 5)).toBe(4);
        expect(CarouselUtils.wrapIndex(-7, 5)).toBe(3);
    });

    it("has nowhere to land when there are no slides", () => {
        expect(CarouselUtils.wrapIndex(3, 0)).toBe(0);
    });
});

describe("getStepTarget", () => {
    it("walks one slide at a time in either direction", () => {
        expect(CarouselUtils.getStepTarget("next", 1, 4)).toBe(2);
        expect(CarouselUtils.getStepTarget("previous", 1, 4)).toBe(0);
    });

    it("wraps at both ends rather than stopping, which is what separates it from the scroller", () => {
        expect(CarouselUtils.getStepTarget("next", 3, 4)).toBe(0);
        expect(CarouselUtils.getStepTarget("previous", 0, 4)).toBe(3);
    });

    it("stays put when there is only one slide to be on", () => {
        expect(CarouselUtils.getStepTarget("next", 0, 1)).toBe(0);
        expect(CarouselUtils.getStepTarget("previous", 0, 1)).toBe(0);
    });
});

describe("resolveIndex", () => {
    it("wraps at both ends when looping", () => {
        expect(CarouselUtils.resolveIndex(4, 4, true)).toBe(0);
        expect(CarouselUtils.resolveIndex(-1, 4, true)).toBe(3);
    });

    it("has nowhere to land past either end when not looping", () => {
        expect(CarouselUtils.resolveIndex(4, 4, false)).toBeUndefined();
        expect(CarouselUtils.resolveIndex(-1, 4, false)).toBeUndefined();
    });

    it("lands inside the range whether looping or not", () => {
        expect(CarouselUtils.resolveIndex(2, 4, false)).toBe(2);
        expect(CarouselUtils.resolveIndex(2, 4, true)).toBe(2);
    });
});

describe("getStepTarget without looping", () => {
    it("stays on the end slide rather than coming round", () => {
        expect(CarouselUtils.getStepTarget("next", 3, 4, false)).toBe(3);
        expect(CarouselUtils.getStepTarget("previous", 0, 4, false)).toBe(0);
    });

    it("still walks one slide at a time away from the ends", () => {
        expect(CarouselUtils.getStepTarget("next", 0, 4, false)).toBe(1);
        expect(CarouselUtils.getStepTarget("previous", 3, 4, false)).toBe(2);
    });
});

describe("getIsStepAtEnd", () => {
    it("marks Previous on the first slide and Next on the last when not looping", () => {
        expect(CarouselUtils.getIsStepAtEnd("previous", 0, 4, false)).toBe(true);
        expect(CarouselUtils.getIsStepAtEnd("next", 3, 4, false)).toBe(true);
    });

    it("leaves the other step at each end free", () => {
        expect(CarouselUtils.getIsStepAtEnd("next", 0, 4, false)).toBe(false);
        expect(CarouselUtils.getIsStepAtEnd("previous", 3, 4, false)).toBe(false);
    });

    it("never marks a step when looping", () => {
        expect(CarouselUtils.getIsStepAtEnd("previous", 0, 4, true)).toBe(false);
        expect(CarouselUtils.getIsStepAtEnd("next", 3, 4, true)).toBe(false);
    });
});

describe("getTurnSteps", () => {
    it("counts one step forward as one step forward", () => {
        expect(CarouselUtils.getTurnSteps(0, 1, 4)).toBe(1);
        expect(CarouselUtils.getTurnSteps(1, 0, 4)).toBe(-1);
    });

    it("goes backwards over the end rather than the whole way round", () => {
        expect(CarouselUtils.getTurnSteps(0, 3, 4)).toBe(-1);
        expect(CarouselUtils.getTurnSteps(3, 0, 4)).toBe(1);
    });

    it("takes the shorter side of a long jump", () => {
        expect(CarouselUtils.getTurnSteps(0, 7, 8)).toBe(-1);
        expect(CarouselUtils.getTurnSteps(0, 5, 8)).toBe(-3);
        expect(CarouselUtils.getTurnSteps(0, 3, 8)).toBe(3);
    });

    it("goes forward when the two are exactly opposite, so the choice is at least the same every time", () => {
        expect(CarouselUtils.getTurnSteps(0, 2, 4)).toBe(2);
        expect(CarouselUtils.getTurnSteps(2, 0, 4)).toBe(2);
    });

    it("has nowhere to turn with no slides", () => {
        expect(CarouselUtils.getTurnSteps(0, 1, 0)).toBe(0);
    });
});

describe("getTravelsAcross", () => {
    it("follows the orientation for a track and the axis for a drum", () => {
        expect(CarouselUtils.getTravelsAcross(false, "column", "horizontal")).toBe(true);
        expect(CarouselUtils.getTravelsAcross(false, "row", "vertical")).toBe(false);
        expect(CarouselUtils.getTravelsAcross(true, "row", "vertical")).toBe(true);
        expect(CarouselUtils.getTravelsAcross(true, "column", "horizontal")).toBe(false);
    });
});

describe("getIsSwipeDisabled", () => {
    it("refuses without controls, while disabled, and with nothing to move between", () => {
        expect(CarouselUtils.getIsSwipeDisabled(false, false, 4)).toBe(true);
        expect(CarouselUtils.getIsSwipeDisabled(true, true, 4)).toBe(true);
        expect(CarouselUtils.getIsSwipeDisabled(true, false, 1)).toBe(true);
    });

    it("takes the swipe otherwise", () => {
        expect(CarouselUtils.getIsSwipeDisabled(true, false, 2)).toBe(false);
    });
});

describe("clampSwipeRatio and getSwipeStep", () => {
    it("holds a swipe to one slide either way", () => {
        expect(CarouselUtils.clampSwipeRatio(1.7)).toBe(1);
        expect(CarouselUtils.clampSwipeRatio(-3)).toBe(-1);
        expect(CarouselUtils.clampSwipeRatio(0.4)).toBe(0.4);
    });

    it("steps forwards for a push left or up and back for a push right or down", () => {
        expect(CarouselUtils.getSwipeStep("left")).toBe(1);
        expect(CarouselUtils.getSwipeStep("up")).toBe(1);
        expect(CarouselUtils.getSwipeStep("right")).toBe(-1);
        expect(CarouselUtils.getSwipeStep("down")).toBe(-1);
    });
});

describe("getIsStepDisabled", () => {
    it("disables every step on a disabled carousel or one with a single slide", () => {
        expect(CarouselUtils.getIsStepDisabled("next", 0, 4, true, true)).toBe(true);
        expect(CarouselUtils.getIsStepDisabled("next", 0, 1, true, false)).toBe(true);
    });

    it("disables only the step at the end of a carousel that does not loop", () => {
        expect(CarouselUtils.getIsStepDisabled("next", 3, 4, false, false)).toBe(true);
        expect(CarouselUtils.getIsStepDisabled("previous", 3, 4, false, false)).toBe(false);
        expect(CarouselUtils.getIsStepDisabled("next", 3, 4, true, false)).toBe(false);
    });
});

describe("getIsRotating", () => {
    const rotating = {
        autoplayDelayMs: 500,
        isPlaying: true,
        isHeld: false,
        isSwiping: false,
        isDisabled: false,
        count: 4,
    };

    it("rotates with a delay, playback on and nothing holding it", () => {
        expect(CarouselUtils.getIsRotating(rotating)).toBe(true);
    });

    it("stops for each thing that holds it", () => {
        expect(CarouselUtils.getIsRotating({ ...rotating, autoplayDelayMs: undefined })).toBe(false);
        expect(CarouselUtils.getIsRotating({ ...rotating, isPlaying: false })).toBe(false);
        expect(CarouselUtils.getIsRotating({ ...rotating, isHeld: true })).toBe(false);
        expect(CarouselUtils.getIsRotating({ ...rotating, isSwiping: true })).toBe(false);
        expect(CarouselUtils.getIsRotating({ ...rotating, isDisabled: true })).toBe(false);
        expect(CarouselUtils.getIsRotating({ ...rotating, count: 1 })).toBe(false);
    });
});

describe("getIsPlaybackAtEnd", () => {
    const atEnd = { isLooping: false, autoplayDelayMs: 500, isPlaying: true, isDisabled: false, count: 4, index: 3 };

    it("stops a carousel that does not loop on its last slide", () => {
        expect(CarouselUtils.getIsPlaybackAtEnd(atEnd)).toBe(true);
    });

    it("leaves every other case alone", () => {
        expect(CarouselUtils.getIsPlaybackAtEnd({ ...atEnd, isLooping: true })).toBe(false);
        expect(CarouselUtils.getIsPlaybackAtEnd({ ...atEnd, index: 2 })).toBe(false);
        expect(CarouselUtils.getIsPlaybackAtEnd({ ...atEnd, isPlaying: false })).toBe(false);
        expect(CarouselUtils.getIsPlaybackAtEnd({ ...atEnd, autoplayDelayMs: undefined })).toBe(false);
        expect(CarouselUtils.getIsPlaybackAtEnd({ ...atEnd, isDisabled: true })).toBe(false);
        expect(CarouselUtils.getIsPlaybackAtEnd({ ...atEnd, count: 1, index: 0 })).toBe(false);
    });
});

describe("getIsAnnounced", () => {
    it("announces a move the user made and not the first slide or a rotation", () => {
        expect(CarouselUtils.getIsAnnounced(0, 1, false)).toBe(true);
        expect(CarouselUtils.getIsAnnounced(undefined, 1, false)).toBe(false);
        expect(CarouselUtils.getIsAnnounced(1, 1, false)).toBe(false);
        expect(CarouselUtils.getIsAnnounced(0, 1, true)).toBe(false);
    });
});

describe("computeTurnAngle", () => {
    it("sets the angle from the index the first time and whenever the count changes", () => {
        expect(CarouselUtils.computeTurnAngle(0, undefined, 1, 4)).toBe(-90);
        expect(CarouselUtils.computeTurnAngle(-450, { index: 1, count: 4 }, 1, 6)).toBe(-60);
    });

    it("accumulates the shorter turn otherwise, so going over the end keeps going the same way", () => {
        expect(CarouselUtils.computeTurnAngle(-270, { index: 3, count: 4 }, 0, 4)).toBe(-360);
        expect(CarouselUtils.computeTurnAngle(0, { index: 0, count: 4 }, 3, 4)).toBe(90);
        expect(CarouselUtils.computeTurnAngle(-90, { index: 1, count: 4 }, 1, 4)).toBe(-90);
    });
});

describe("getDrumAngle and getTrackTransform", () => {
    it("adds a swipe under way to the resting angle", () => {
        expect(CarouselUtils.getDrumAngle(-90, 0.5, 4)).toBe(-45);
    });

    it("slides the track by whole slides and the swipe's share of one", () => {
        expect(CarouselUtils.getTrackTransform(true, 0, 2)).toBe("translateX(-200%)");
        expect(CarouselUtils.getTrackTransform(false, 0.5, 1)).toBe("translateY(-50%)");
    });
});
