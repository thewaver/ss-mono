import { describe, expect, it } from "vitest";

import { InteractionTrackerUtils } from "./InteractionTracker.utils";

describe("computeIsReachable", () => {
    it("is reachable only when all three hold", () => {
        expect(InteractionTrackerUtils.computeIsReachable(true, true, true)).toBe(true);
    });

    it("is not reachable when the control is not disabled, since it is already in the tab order", () => {
        expect(InteractionTrackerUtils.computeIsReachable(false, true, true)).toBe(false);
    });

    it("is not reachable when the consumer did not ask for it", () => {
        expect(InteractionTrackerUtils.computeIsReachable(true, false, true)).toBe(false);
    });

    it("is not reachable without a tooltip, because there would be nothing to explain", () => {
        expect(InteractionTrackerUtils.computeIsReachable(true, true, false)).toBe(false);
    });
});
