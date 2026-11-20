import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InteractionTrackerUtils } from "./InteractionTracker.utils";

describe("computeIsReachable", () => {
    it("is reachable when the control is disabled and the consumer asked for it", () => {
        expect(InteractionTrackerUtils.computeIsReachable(true, true, false, true)).toBe(true);
    });

    it("is not reachable when the consumer asked for it but there is no tooltip to explain why", () => {
        expect(InteractionTrackerUtils.computeIsReachable(true, true, false, false)).toBe(false);
    });

    it("is reachable without a tooltip when the component insists", () => {
        expect(InteractionTrackerUtils.computeIsReachable(true, false, true, false)).toBe(true);
    });

    it("is not reachable when the control is not disabled, since it is already in the tab order", () => {
        expect(InteractionTrackerUtils.computeIsReachable(false, true, false, true)).toBe(false);
    });

    it("is not reachable when the consumer did not ask for it", () => {
        expect(InteractionTrackerUtils.computeIsReachable(true, false, false, true)).toBe(false);
    });

    it("is reachable when the component insists, whatever the consumer said", () => {
        expect(InteractionTrackerUtils.computeIsReachable(true, false, true, true)).toBe(true);
    });
});

describe("getIsPlainClick", () => {
    const PLAIN = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false };

    it("is plain for the main button with no modifier held", () => {
        expect(InteractionTrackerUtils.getIsPlainClick(PLAIN)).toBe(true);
    });

    it.each(["metaKey", "ctrlKey", "shiftKey", "altKey"] as const)("is not plain with %s held", (key) => {
        expect(InteractionTrackerUtils.getIsPlainClick({ ...PLAIN, [key]: true })).toBe(false);
    });

    it("is not plain for the middle button", () => {
        expect(InteractionTrackerUtils.getIsPlainClick({ ...PLAIN, button: 1 })).toBe(false);
    });
});

describe("getIsComposing", () => {
    it("takes a key for the input method's while a word is composed, either way the browser says so", () => {
        expect(InteractionTrackerUtils.getIsComposing({ isComposing: true, keyCode: 13 })).toBe(true);
        expect(InteractionTrackerUtils.getIsComposing({ isComposing: false, keyCode: 229 })).toBe(true);
        expect(InteractionTrackerUtils.getIsComposing({ isComposing: false, keyCode: 13 })).toBe(false);
    });
});

describe("createStepRepeater", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    const makeRepeater = () =>
        InteractionTrackerUtils.createStepRepeater({ getDelayMs: () => 400, getIntervalMs: () => 60 });

    it("steps once at once, and repeats only after the delay", () => {
        const repeater = makeRepeater();
        const step = vi.fn(() => true);

        expect(repeater.start(step)).toBe(true);
        expect(step).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(399);
        expect(step).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(1 + 60 * 3);
        expect(step).toHaveBeenCalledTimes(4);
    });

    it("stops repeating when stopped, and says whether anything was running", () => {
        const repeater = makeRepeater();
        const step = vi.fn(() => true);

        repeater.start(step);

        expect(repeater.stop()).toBe(true);
        expect(repeater.stop()).toBe(false);

        vi.advanceTimersByTime(2000);
        expect(step).toHaveBeenCalledTimes(1);
    });

    it("starts nothing when the first step is refused", () => {
        const repeater = makeRepeater();
        const step = vi.fn(() => false);

        expect(repeater.start(step)).toBe(false);

        vi.advanceTimersByTime(2000);
        expect(step).toHaveBeenCalledTimes(1);
        expect(repeater.stop()).toBe(false);
    });

    it("ends the repeat at the first refused step, so a release nobody heard cannot leave it running", () => {
        const repeater = makeRepeater();
        let value = 2;
        const step = vi.fn(() => {
            if (value <= 1) return false;

            value -= 1;

            return true;
        });

        repeater.start(step);
        vi.advanceTimersByTime(400 + 60);

        expect(value).toBe(1);
        expect(repeater.stop(), "nothing is left running once the bound refused a step").toBe(false);

        value = 5;
        vi.advanceTimersByTime(2000);

        expect(value, "so a value moved away from the bound afterwards stays where it was put").toBe(5);
    });
});
