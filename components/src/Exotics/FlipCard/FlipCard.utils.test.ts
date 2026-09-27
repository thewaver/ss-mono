import { describe, expect, it } from "vitest";

import { FlipCardUtils } from "./FlipCard.utils";

describe("computeRestingAngle", () => {
    it("starts a card on the side it was given, before it has ever turned", () => {
        expect(FlipCardUtils.computeRestingAngle(undefined, false, undefined)).toBe(0);
        expect(FlipCardUtils.computeRestingAngle(undefined, true, undefined)).toBe(-180);
    });

    it("retraces the way it came when no direction is set", () => {
        const back = FlipCardUtils.computeRestingAngle(0, true, undefined);

        expect(FlipCardUtils.computeRestingAngle(back, false, undefined)).toBe(0);
    });

    it("keeps going round when the same direction is set on every turn", () => {
        const once = FlipCardUtils.computeRestingAngle(0, true, "forward");
        const twice = FlipCardUtils.computeRestingAngle(once, false, "forward");

        expect(twice - once).toBe(once);
        expect(Math.abs(twice)).toBe(360);
    });

    it("turns the two directions opposite ways", () => {
        expect(Math.sign(FlipCardUtils.computeRestingAngle(0, true, "forward"))).toBe(
            -Math.sign(FlipCardUtils.computeRestingAngle(0, true, "backward")),
        );
    });
});

describe("computeAngle", () => {
    it("adds nothing to the resting angle while the card lies flat", () => {
        expect(FlipCardUtils.computeAngle(-180, true, 0, undefined)).toBe(-180);
    });

    it("leans the way the next turn would go", () => {
        const restingAngle = FlipCardUtils.computeRestingAngle(0, true, "backward");
        const lean = FlipCardUtils.computeAngle(restingAngle, true, 0.5, "backward") - restingAngle;
        const nextTurn = FlipCardUtils.computeRestingAngle(restingAngle, false, "backward") - restingAngle;

        expect(Math.sign(lean)).toBe(Math.sign(nextTurn));
        expect(Math.abs(lean)).toBe(90);
    });
});

describe("getPeekRatio", () => {
    it("clamps a lean to the half turn it can mean", () => {
        expect(FlipCardUtils.getPeekRatio(-1)).toBe(0);
        expect(FlipCardUtils.getPeekRatio(2)).toBe(1);
    });
});

describe("getTransitionDurationMs", () => {
    it("turns over the given duration while flat and follows a lean directly", () => {
        expect(FlipCardUtils.getTransitionDurationMs(0, 600)).toBe(600);
        expect(FlipCardUtils.getTransitionDurationMs(0.2, 600)).toBe(0);
    });
});
