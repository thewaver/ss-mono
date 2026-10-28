import { describe, expect, it } from "vitest";

import { PointerTrackerUtils } from "../../Abstracts/PointerTracker/PointerTracker.utils";
import { PointerEffectsUtils } from "./PointerEffects.utils";

const readingAt = (distance: number, edgeDistance = 50) => ({
    ...PointerTrackerUtils.RESTING,
    offset: { x: distance, y: 0 },
    distance,
    edgeDistance,
});

describe("getIsResting", () => {
    it("rests while turned off or with no pointer on the page, wherever the reading says it is", () => {
        expect(PointerEffectsUtils.getIsResting(true, true, readingAt(0), undefined)).toBe(true);
        expect(PointerEffectsUtils.getIsResting(false, false, readingAt(0), undefined)).toBe(true);
    });

    it("answers a pointer at any distance when no active range is set", () => {
        expect(PointerEffectsUtils.getIsResting(false, true, readingAt(5000), undefined)).toBe(false);
    });

    it("rests once the pointer is further off than the active range, and not at the range itself", () => {
        expect(PointerEffectsUtils.getIsResting(false, true, readingAt(200), 200)).toBe(false);
        expect(PointerEffectsUtils.getIsResting(false, true, readingAt(201), 200)).toBe(true);
    });
});

describe("computeEdgeStrength", () => {
    it("is full strength anywhere on the element", () => {
        expect(PointerEffectsUtils.computeEdgeStrength(readingAt(30), 300)).toBe(1);
    });

    it("fades from the edge rather than from the center", () => {
        expect(PointerEffectsUtils.computeEdgeStrength(readingAt(175), 300)).toBe(0.5);
        expect(PointerEffectsUtils.computeEdgeStrength(readingAt(300), 300)).toBe(0);
        expect(PointerEffectsUtils.computeEdgeStrength(readingAt(900), 300)).toBe(0);
    });

    it("reaches nothing off the element when the range does not reach past its edge", () => {
        expect(PointerEffectsUtils.computeEdgeStrength(readingAt(60), 40)).toBe(0);
    });
});

describe("computeLightFilter", () => {
    it("writes brightness alone while lightness stays untouched", () => {
        expect(PointerEffectsUtils.computeLightFilter(0, {})).toBe("brightness(1)");
    });

    it("stacks a fade toward white on the brightness once lightness moves", () => {
        expect(PointerEffectsUtils.computeLightFilter(1, { maxBrightness: 2, maxLightness: 0.25 })).toBe(
            "brightness(2) invert(1) brightness(0.75) invert(1)",
        );
    });
});

describe("computeShadowTargets", () => {
    it("drops the resting shadow straight down, however the pointer lies", () => {
        const [x, y, blur, alpha] = PointerEffectsUtils.computeShadowTargets(readingAt(10), true, {
            restingThrowPx: 7,
            restingBlurPx: 3,
            restingOpacity: 0.4,
        });

        expect([x, y, blur, alpha]).toEqual([0, 7, 3, 0.4]);
    });

    it("throws the shadow away from the pointer, further the further off it is", () => {
        const near = PointerEffectsUtils.computeShadowTargets(readingAt(100), false, { lightRangePx: 400 });
        const far = PointerEffectsUtils.computeShadowTargets(readingAt(300), false, { lightRangePx: 400 });

        expect(near[0], "a pointer to the right throws the shadow left").toBeLessThan(0);
        expect(far[0]).toBeLessThan(near[0]);
        expect(far[3], "and fainter").toBeLessThan(near[3]);
    });
});

describe("computeShadowFilter", () => {
    it("replaces the color's own alpha with the shadow's", () => {
        expect(PointerEffectsUtils.computeShadowFilter([1, 2, 3, 0.5], "#FF0000FF")).toContain(
            "drop-shadow(1px 2px 3px",
        );
        expect(PointerEffectsUtils.computeShadowFilter([1, 2, 3, 0.5], "#FF0000FF")).toContain("0.5");
    });
});

describe("computeTilterState", () => {
    it("lies flat with the lean at nothing", () => {
        const state = PointerEffectsUtils.computeTilterState([0, 0, 0], { x: 0.5, y: 0.5 }, 15, true);

        expect(Math.abs(state.tilt.x)).toBe(0);
        expect(Math.abs(state.tilt.y)).toBe(0);
        expect(state.sheenPosition).toBe(50);
    });

    it("turns to the full angle at the very edge, and runs the sheen the other way", () => {
        const state = PointerEffectsUtils.computeTilterState([0.5, 0, 1], { x: 1, y: 0.5 }, 15, false);

        expect(state.tilt.y).toBe(15);
        expect(state.sheenPosition).toBeLessThan(50);
    });
});
