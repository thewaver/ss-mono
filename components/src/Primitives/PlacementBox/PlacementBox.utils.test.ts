import { describe, expect, it } from "vitest";

import type { PlacementLayout } from "../../Abstracts/Placement/Placement.types";
import { ProximityUtils } from "../../Abstracts/Proximity/Proximity.utils";
import { PlacementBoxUtils } from "./PlacementBox.utils";

const LAYOUT: PlacementLayout = {
    heightRatio: 0.5,
    reachRule: "horizontal",
    placements: [
        { leftShare: 0.25, topShare: 0.25, widthShare: 0.2, heightShare: 0.2 },
        { leftShare: 0.75, topShare: 0.25, widthShare: 0.2, heightShare: 0.2 },
    ],
};

const CENTER = { x: 0.5, y: 0.5 };

describe("computePointerPoint", () => {
    it("scales the pointer's height into the layout's own coordinates", () => {
        expect(PlacementBoxUtils.computePointerPoint(LAYOUT, CENTER, true, true)).toEqual({ x: 0.5, y: 0.25 });
    });

    it("has no point without an effect, or without a pointer", () => {
        expect(PlacementBoxUtils.computePointerPoint(LAYOUT, CENTER, true, false)).toBeUndefined();
        expect(PlacementBoxUtils.computePointerPoint(LAYOUT, CENTER, false, true)).toBeUndefined();
    });

    it("drops a pointer the layout does not reach", () => {
        expect(PlacementBoxUtils.computePointerPoint(LAYOUT, { x: 0.5, y: 2 }, true, true)).toBeUndefined();
    });
});

describe("computeArrangement", () => {
    it("rests without an effect", () => {
        expect(PlacementBoxUtils.computeArrangement(LAYOUT, false)).toBe(ProximityUtils.RESTING_ARRANGEMENT);
        expect(PlacementBoxUtils.computeArrangement(LAYOUT, true)).toEqual(ProximityUtils.toArrangement(LAYOUT));
    });
});

describe("computeOverreach", () => {
    it("is nothing without a pointer", () => {
        expect(PlacementBoxUtils.computeOverreach(LAYOUT, undefined)).toBe(0);
    });
});

describe("getIsMotionQueryNeeded", () => {
    it("listens only for an effect or a glide", () => {
        expect(PlacementBoxUtils.getIsMotionQueryNeeded(false, 0)).toBe(false);
        expect(PlacementBoxUtils.getIsMotionQueryNeeded(true, 0)).toBe(true);
        expect(PlacementBoxUtils.getIsMotionQueryNeeded(false, 300)).toBe(true);
    });
});

describe("computeTransitionDurationMs", () => {
    it("keeps the glide unless motion is reduced", () => {
        expect(PlacementBoxUtils.computeTransitionDurationMs(300, false)).toBe(300);
        expect(PlacementBoxUtils.computeTransitionDurationMs(300, true)).toBe(0);
    });
});
