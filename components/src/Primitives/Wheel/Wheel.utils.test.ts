import { describe, expect, it } from "vitest";

import type { PlacementLayout } from "../../Abstracts/Placement/Placement.types";
import { WheelUtils } from "./Wheel.utils";

const RESTING = {
    leftShare: 0.5,
    topShare: 0.1,
    widthShare: 0.2,
    heightShare: 0.2,
    sector: { innerRadius: 0, outerRadius: 0.5, fromAngle: 0, toAngle: 90 },
};

const LAYOUT: PlacementLayout = { placements: [RESTING], heightRatio: 1, reachRule: "plane" };

describe("computeLayout", () => {
    it("asks for the root of a ring with nothing around it", () => {
        const seen: unknown[] = [];

        WheelUtils.computeLayout((defs) => {
            seen.push(defs);

            return LAYOUT;
        }, 6);

        expect(seen).toEqual([{ itemCount: 6, path: [], parentExtent: 0 }]);
    });

    it("has no layout without a layout function", () => {
        expect(WheelUtils.computeLayout(undefined, 6)).toBeUndefined();
    });
});

describe("getMarkerCorrection", () => {
    it("turns the first sector's middle onto the marker", () => {
        expect(WheelUtils.getMarkerCorrection(LAYOUT, -90)).toBe(-135);
    });

    it("leaves the wedges alone when there is no sector to measure", () => {
        expect(WheelUtils.getMarkerCorrection(undefined, -90)).toBe(0);
        const unmeasured = { ...LAYOUT, placements: [{ ...RESTING, sector: undefined }] };

        expect(WheelUtils.getMarkerCorrection(unmeasured, -90)).toBe(0);
    });
});

describe("getWedgeAngle", () => {
    it("adds the wedge's own place round the wheel to the correction and the wheel's turn", () => {
        expect(WheelUtils.getWedgeAngle(-45, 2, 60, 10)).toBe(85);
    });
});

describe("getSelectedIndex and getIsUserSpinning", () => {
    it("picks nothing while idling and the wedge at the marker otherwise", () => {
        expect(WheelUtils.getSelectedIndex("idling", 3)).toBeUndefined();
        expect(WheelUtils.getSelectedIndex("spinning", 3)).toBe(3);
        expect(WheelUtils.getSelectedIndex("still", 0)).toBe(0);
    });

    it("counts a spin from the moment it is asked for until it has settled", () => {
        expect(WheelUtils.getIsUserSpinning(true, "idling")).toBe(true);
        expect(WheelUtils.getIsUserSpinning(false, "spinning")).toBe(true);
        expect(WheelUtils.getIsUserSpinning(false, "settling")).toBe(true);
        expect(WheelUtils.getIsUserSpinning(false, "still")).toBe(false);
        expect(WheelUtils.getIsUserSpinning(false, "idling")).toBe(false);
    });
});

describe("getPointerPoint and getOverreach", () => {
    it("has no point without a pointer or a layout", () => {
        expect(WheelUtils.getPointerPoint(LAYOUT, { x: 0.5, y: 0.5 }, false)).toBeUndefined();
        expect(WheelUtils.getPointerPoint(undefined, { x: 0.5, y: 0.5 }, true)).toBeUndefined();
    });

    it("reads a pointer over the wheel in the layout's coordinates", () => {
        expect(WheelUtils.getPointerPoint(LAYOUT, { x: 0.25, y: 0.75 }, true)).toEqual({ x: 0.25, y: 0.75 });
    });

    it("has no overreach without a point", () => {
        expect(WheelUtils.getOverreach(LAYOUT, undefined)).toBe(0);
        expect(WheelUtils.getOverreach(undefined, { x: 0, y: 0 })).toBe(0);
    });
});

describe("computeWedgeEffect", () => {
    const base = {
        layout: LAYOUT,
        arrangement: { spacing: 0.1, radius: 0.5, slack: 0 },
        angle: 0,
        point: undefined,
        overreach: 0,
        prefersReducedMotion: false,
    };

    it("has nothing to apply without an effect", () => {
        expect(WheelUtils.computeWedgeEffect({ ...base, computeEffect: undefined })).toBeUndefined();
    });

    it("hands the effect the wedge turned to where it is, framed by the whole wheel", () => {
        const seen: { leftShare: number; topShare: number; angle?: number }[] = [];

        const effect = WheelUtils.computeWedgeEffect({
            ...base,
            angle: 180,
            computeEffect: (defs) => {
                seen.push(defs.placement);

                return { scale: 2 };
            },
        });

        expect(seen[0].leftShare).toBeCloseTo(0.5);
        expect(seen[0].topShare, "the wedge at the top, turned half way round, sits at the bottom").toBeCloseTo(0.9);
        expect(seen[0].angle).toBe(180);
        expect(effect?.transform, "and what it answers comes back as a transform").toContain("scale(");
    });
});

describe("getWedgeTransform", () => {
    it("turns the wedge, then applies the effect's own transform after it", () => {
        expect(WheelUtils.getWedgeTransform(30, undefined)).toBe("rotate(30deg)");
        expect(WheelUtils.getWedgeTransform(30, { transform: "scale(2)", filter: "" })).toBe("rotate(30deg) scale(2)");
    });
});
