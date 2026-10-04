import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TurnClockUtils } from "./TurnClock.utils";

const NEVER_PAINTS = () => 0;

describe("createTween", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.stubGlobal("requestAnimationFrame", NEVER_PAINTS);
        vi.stubGlobal("cancelAnimationFrame", () => {});
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it("arrives at once, before it returns, when the turn takes no time", () => {
        const arrivals: string[] = [];

        TurnClockUtils.createTween().run(
            0,
            () => arrivals.push("frame"),
            () => arrivals.push("arrived"),
        );

        expect(arrivals).toEqual(["arrived"]);
    });

    it("still arrives, once, in a tab that never paints", () => {
        const onArrive = vi.fn();

        TurnClockUtils.createTween().run(500, () => {}, onArrive);
        vi.advanceTimersByTime(499);

        expect(onArrive).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1000);

        expect(onArrive).toHaveBeenCalledTimes(1);
    });

    it("never arrives once canceled, and a second run replaces the first", () => {
        const tween = TurnClockUtils.createTween();
        const first = vi.fn();
        const second = vi.fn();

        tween.run(500, () => {}, first);
        tween.run(500, () => {}, second);
        vi.advanceTimersByTime(1000);

        expect(first).not.toHaveBeenCalled();
        expect(second).toHaveBeenCalledTimes(1);

        tween.run(500, () => {}, first);
        tween.cancel();
        vi.advanceTimersByTime(1000);

        expect(first).not.toHaveBeenCalled();
    });
});

describe("holdRest", () => {
    beforeEach(() => vi.useFakeTimers());

    afterEach(() => vi.useRealTimers());

    it("ends the rest after its time, unless it is called off first", () => {
        const onEnd = vi.fn();
        const calledOff = vi.fn();

        TurnClockUtils.holdRest(300, onEnd);
        TurnClockUtils.holdRest(300, calledOff)();
        vi.advanceTimersByTime(300);

        expect(onEnd).toHaveBeenCalledTimes(1);
        expect(calledOff).not.toHaveBeenCalled();
    });

    it("rests for good at a negative time", () => {
        const onEnd = vi.fn();

        TurnClockUtils.holdRest(-1, onEnd);
        vi.advanceTimersByTime(100000);

        expect(onEnd).not.toHaveBeenCalled();
    });
});

describe("createTargetRequest", () => {
    it("hands on a target that arrives later, and reports one that is refused", async () => {
        const request = TurnClockUtils.createTargetRequest();
        const onTarget = vi.fn();
        const onRefused = vi.fn();

        request.request(() => Promise.resolve(4), onTarget, onRefused);
        request.request(() => Promise.reject(new Error("no")), onTarget, onRefused);
        await vi.waitFor(() => expect(onRefused).toHaveBeenCalledTimes(1));

        expect(onTarget).toHaveBeenCalledWith(4);
    });

    it("ignores the answer to a request canceled while it was waited for", async () => {
        const request = TurnClockUtils.createTargetRequest();
        const onTarget = vi.fn();

        request.request(
            () => Promise.resolve(4),
            onTarget,
            () => {},
        );
        request.cancel();
        await Promise.resolve();
        await Promise.resolve();

        expect(onTarget).not.toHaveBeenCalled();
    });
});

describe("getIsIdling", () => {
    it("idles only when every condition allows it", () => {
        const allowed = { idleDelayMs: 1000, isIdleAllowed: true, isResting: false, isRotatable: true };

        expect(TurnClockUtils.getIsIdling(allowed)).toBe(true);
        expect(TurnClockUtils.getIsIdling({ ...allowed, idleDelayMs: undefined })).toBe(false);
        expect(TurnClockUtils.getIsIdling({ ...allowed, isIdleAllowed: false })).toBe(false);
        expect(TurnClockUtils.getIsIdling({ ...allowed, isResting: true })).toBe(false);
        expect(TurnClockUtils.getIsIdling({ ...allowed, isRotatable: false })).toBe(false);
    });
});
