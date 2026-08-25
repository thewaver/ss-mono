import { describe, expect, it } from "vitest";

import { InteractionTracker } from "./InteractionTracker";

describe("computeIsReachable", () => {
    it("is reachable only when all three hold", () => {
        expect(InteractionTracker.computeIsReachable(true, true, true)).toBe(true);
    });

    it("is not reachable when the control is not disabled, since it is already in the tab order", () => {
        expect(InteractionTracker.computeIsReachable(false, true, true)).toBe(false);
    });

    it("is not reachable when the consumer did not ask for it", () => {
        expect(InteractionTracker.computeIsReachable(true, false, true)).toBe(false);
    });

    it("is not reachable without a tooltip, because there would be nothing to explain", () => {
        expect(InteractionTracker.computeIsReachable(true, true, false)).toBe(false);
    });
});
