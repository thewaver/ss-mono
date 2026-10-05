import { describe, expect, it } from "vitest";

import { ProximityTextUtils } from "./ProximityText.utils";

const BOXES = [
    { x: 0, y: 0, width: 10, height: 10 },
    { x: 100, y: 0, width: 10, height: 10 },
];

describe("computeStrengths", () => {
    it("is full under the point and nothing past the reach", () => {
        expect(ProximityTextUtils.computeStrengths(BOXES, { x: 5, y: 5 }, 50)).toEqual([1, 0]);
    });

    it("falls with the square of the distance, so halfway is three quarters", () => {
        expect(ProximityTextUtils.computeStrengths(BOXES, { x: 30, y: 5 }, 50)[0]).toBeCloseTo(0.75);
    });

    it("rests every letter while there is no point", () => {
        expect(ProximityTextUtils.computeStrengths(BOXES, undefined, 50)).toEqual([0, 0]);
    });

    it("counts only up and down on the vertical axis, however far across the point is", () => {
        expect(ProximityTextUtils.computeStrengths(BOXES, { x: 500, y: 5 }, 50, "vertical")[0]).toBe(1);
        expect(ProximityTextUtils.computeStrengths(BOXES, { x: 500, y: 5 }, 50, "both")[0]).toBe(0);
    });
});

describe("toLetterAnimation", () => {
    it("holds the keyframes at the strength's share of the way through", () => {
        const resting = ProximityTextUtils.toLetterAnimation("swell", 0);
        const full = ProximityTextUtils.toLetterAnimation("swell", 1);

        expect(resting.delayMs).toBeCloseTo(0);
        expect(full.delayMs).toBe(-full.durationMs);
    });
});

describe("toPoint", () => {
    it("places the point in the text's box, and reports none while absent", () => {
        const reading = { boxRatio: { x: 0.5, y: 0.25 } } as Parameters<typeof ProximityTextUtils.toPoint>[0];

        expect(ProximityTextUtils.toPoint(reading, true, { width: 200, height: 40 })).toEqual({ x: 100, y: 10 });
        expect(ProximityTextUtils.toPoint(reading, false, { width: 200, height: 40 })).toBeUndefined();
    });
});
