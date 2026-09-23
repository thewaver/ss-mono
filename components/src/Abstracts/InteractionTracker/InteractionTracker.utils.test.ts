import { describe, expect, it } from "vitest";

import { InteractionTrackerUtils } from "./InteractionTracker.utils";

describe("computeIsReachable", () => {
    it("is reachable when the control is disabled and the consumer asked for it", () => {
        expect(InteractionTrackerUtils.computeIsReachable(true, true)).toBe(true);
    });

    it("is not reachable when the control is not disabled, since it is already in the tab order", () => {
        expect(InteractionTrackerUtils.computeIsReachable(false, true)).toBe(false);
    });

    it("is not reachable when the consumer did not ask for it", () => {
        expect(InteractionTrackerUtils.computeIsReachable(true, false)).toBe(false);
    });

    it("is reachable when the component insists, whatever the consumer said", () => {
        expect(InteractionTrackerUtils.computeIsReachable(true, false, true)).toBe(true);
    });
});
