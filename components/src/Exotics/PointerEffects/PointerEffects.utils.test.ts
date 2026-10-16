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

describe("computeCenterStrength", () => {
    it("is full strength dead on the center and falls evenly to nothing at the range", () => {
        expect(PointerEffectsUtils.computeCenterStrength(readingAt(0), 300)).toBe(1);
        expect(PointerEffectsUtils.computeCenterStrength(readingAt(75), 300)).toBe(0.75);
        expect(PointerEffectsUtils.computeCenterStrength(readingAt(150), 300)).toBe(0.5);
        expect(PointerEffectsUtils.computeCenterStrength(readingAt(300), 300)).toBe(0);
    });

    it("stays at nothing past the range, and for a range of nothing or less", () => {
        expect(PointerEffectsUtils.computeCenterStrength(readingAt(900), 300)).toBe(0);
        expect(PointerEffectsUtils.computeCenterStrength(readingAt(0), 0)).toBe(0);
        expect(PointerEffectsUtils.computeCenterStrength(readingAt(0), -10)).toBe(0);
    });

    it("keeps growing on the element, unlike the edge strength that is already full there", () => {
        const near = PointerEffectsUtils.computeCenterStrength(readingAt(10, 50), 300);
        const far = PointerEffectsUtils.computeCenterStrength(readingAt(40, 50), 300);

        expect(near).toBeGreaterThan(far);
    });
});

describe("resolveColorMixing", () => {
    it("is additive for a page that says it is dark, and subtractive for one that says it is light", () => {
        expect(PointerEffectsUtils.resolveColorMixing("dark", false)).toBe("additive");
        expect(PointerEffectsUtils.resolveColorMixing("dark", true)).toBe("additive");
        expect(PointerEffectsUtils.resolveColorMixing("light", false)).toBe("subtractive");
        expect(PointerEffectsUtils.resolveColorMixing("light", true)).toBe("subtractive");
    });

    it("lets the system setting decide when both are declared, whichever order they come in", () => {
        expect(PointerEffectsUtils.resolveColorMixing("light dark", true)).toBe("additive");
        expect(PointerEffectsUtils.resolveColorMixing("light dark", false)).toBe("subtractive");
        expect(PointerEffectsUtils.resolveColorMixing("dark light", true)).toBe("additive");
        expect(PointerEffectsUtils.resolveColorMixing("dark light", false)).toBe("subtractive");
    });

    it("reads past the word only", () => {
        expect(PointerEffectsUtils.resolveColorMixing("only dark", false)).toBe("additive");
        expect(PointerEffectsUtils.resolveColorMixing("only light", true)).toBe("subtractive");
    });

    it("treats a page that sets nothing as light, whatever the system asks for", () => {
        expect(PointerEffectsUtils.resolveColorMixing("normal", true)).toBe("subtractive");
        expect(PointerEffectsUtils.resolveColorMixing("", true)).toBe("subtractive");
    });
});

describe("pickSplitTargets", () => {
    it("draws three targets, all inside the unit circle", () => {
        const draws = Array.from({ length: 200 }, () => PointerEffectsUtils.pickSplitTargets());

        draws.forEach((targets) => {
            expect(targets).toHaveLength(3);
            targets.forEach((target) => expect(Math.hypot(target.x, target.y)).toBeLessThanOrEqual(1 + 1e-9));
        });
    });

    it("takes its numbers from the random source it is given, radius first and then angle", () => {
        const numbers = [0.25, 0, 1, 0.25, 0, 0.5];
        let next = 0;

        const targets = PointerEffectsUtils.pickSplitTargets(() => numbers[next++]);

        expect(next).toBe(6);
        expect(targets[0].x).toBeCloseTo(0.5);
        expect(targets[0].y).toBeCloseTo(0);
        expect(Math.hypot(targets[1].x, targets[1].y)).toBeCloseTo(1);
    });

    it("spreads over the area, so a draw of a quarter lands at half the radius", () => {
        const targets = PointerEffectsUtils.pickSplitTargets(() => 0.25);

        expect(Math.hypot(targets[0].x, targets[0].y)).toBeCloseTo(0.5);
    });
});

describe("openSplit", () => {
    it("settles three targets and a subtractive mixing when there is no element to read", () => {
        const opening = PointerEffectsUtils.openSplit(undefined, () => 0.5);

        expect(opening.targets).toHaveLength(3);
        expect(opening.colorMixing).toBe("subtractive");
    });
});

describe("computeSplitTargets", () => {
    const targets = [
        { x: 1, y: 0 },
        { x: 0, y: -0.5 },
        { x: -0.5, y: 0.5 },
    ];

    it("scales every target by the strength and the furthest shift, as one flat list", () => {
        expect(PointerEffectsUtils.computeSplitTargets(targets, 1, 10)).toEqual([10, 0, 0, -5, -5, 5]);
        expect(PointerEffectsUtils.computeSplitTargets(targets, 0.5, 10)).toEqual([5, 0, 0, -2.5, -2.5, 2.5]);
    });

    it("closes every channel at no strength", () => {
        const closed = PointerEffectsUtils.computeSplitTargets(targets, 0, 10);

        expect(closed.every((value) => value === 0)).toBe(true);
    });
});

describe("getSplitShift and getIsSplit", () => {
    const split = [1, 2, 3, 4, 5, 6];

    it("reads each channel pair out of the list in red, green, blue order", () => {
        expect(PointerEffectsUtils.getSplitShift(split, 0)).toEqual({ x: 1, y: 2 });
        expect(PointerEffectsUtils.getSplitShift(split, 1)).toEqual({ x: 3, y: 4 });
        expect(PointerEffectsUtils.getSplitShift(split, 2)).toEqual({ x: 5, y: 6 });
    });

    it("reads a short list as no shift", () => {
        expect(PointerEffectsUtils.getSplitShift([], 1)).toEqual({ x: 0, y: 0 });
    });

    it("is split when any one value is away from zero, and not otherwise", () => {
        expect(PointerEffectsUtils.getIsSplit([0, 0, 0, 0, 0, 0])).toBe(false);
        expect(PointerEffectsUtils.getIsSplit([0, 0, 0, 0, 0, 0.01])).toBe(true);
        expect(PointerEffectsUtils.getIsSplit([])).toBe(false);
    });
});
