import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RotatorUtils } from "./Rotator.utils";

vi.mock("../LiveAnnouncer/LiveAnnouncer.utils", () => ({
    LiveAnnouncerUtils: { reserve: () => {}, announce: () => {} },
}));

const NEVER_PAINTS = () => 0;

describe("createRotator", () => {
    beforeEach(() => {
        vi.stubGlobal("requestAnimationFrame", NEVER_PAINTS);
        vi.stubGlobal("cancelAnimationFrame", () => {});
    });

    afterEach(() => vi.unstubAllGlobals());

    it("can spin again after a target function threw", async () => {
        let isThrowing = true;
        let targetIndex = 0;

        const rotator = RotatorUtils.createRotator({
            getIsDisabled: () => false,
            getStepCount: () => 4,
            getSpinDurationMs: () => 0,
            getSettleDurationMs: () => 0,
            targetIndex: [() => targetIndex, (value) => (targetIndex = value)],
            computeSpinTarget: () => {
                if (isThrowing) throw new Error("no");

                return 2;
            },
            computeStepLabel: (index) => String(index),
        });

        expect(rotator.spin()).toBe(true);
        await vi.waitFor(() => expect(rotator.get().isAwaitingTarget).toBe(false));

        isThrowing = false;

        expect(rotator.spin()).toBe(true);
        await vi.waitFor(() => expect(rotator.get().isResting).toBe(true));

        expect(targetIndex).toBe(2);
    });
});
