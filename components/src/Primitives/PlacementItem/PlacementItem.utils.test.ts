import { describe, expect, it } from "vitest";

import type { PlacementRect } from "../../Abstracts/Placement/Placement.types";
import type { PlacementBoxContextType } from "../PlacementBox/PlacementBox.context.types";
import { PlacementBoxUtils } from "../PlacementBox/PlacementBox.utils";
import { PlacementItemUtils } from "./PlacementItem.utils";

const RECT: PlacementRect = { leftShare: 0.25, topShare: 0.5, widthShare: 0.2, heightShare: 0.1 };

const withEffect = (point: PlacementBoxContextType["getPointerPoint"]): PlacementBoxContextType => ({
    ...PlacementBoxUtils.UNTRACKED_CONTEXT,
    getPointerPoint: point,
    getComputeEffect: () => (defs) => ({ scale: defs.ratio < 1 ? [200, 200] : [100, 100] }),
});

describe("toTransition", () => {
    it("eases where the item is and how it is sized and turned, each with the item's own wait", () => {
        const transition = PlacementItemUtils.toTransition(300, 50);

        for (const property of ["left", "top", "width", "height", "rotate"]) {
            expect(transition).toContain(`${property} 300ms ease 50ms`);
        }

        expect(transition).not.toContain("transform");
    });
});

describe("computeStyleValues", () => {
    it("writes the placement in units of the box's width", () => {
        const values = PlacementItemUtils.computeStyleValues(RECT, undefined, undefined, undefined);

        expect(values.left).toBe("25cqw");
        expect(values.top).toBe("50cqw");
        expect(values.rotate).toBe("0deg");
    });

    it("stacks by the placement's own depth ahead of the consumer's order", () => {
        expect(PlacementItemUtils.computeStyleValues(RECT, 3, undefined, undefined).zIndex).toBe(3);
        expect(PlacementItemUtils.computeStyleValues({ ...RECT, depth: 7 }, 3, undefined, undefined).zIndex).toBe(7);
    });

    it("leaves an empty effect unwritten", () => {
        const values = PlacementItemUtils.computeStyleValues(RECT, undefined, { transform: "", filter: "" }, undefined);

        expect(values.transform).toBeUndefined();
        expect(values.filter).toBeUndefined();
    });
});

describe("computeEffectStyle", () => {
    it("is nothing outside a box, or in a box with no effect", () => {
        expect(PlacementItemUtils.computeEffectStyle(RECT, PlacementBoxUtils.UNTRACKED_CONTEXT)).toBeUndefined();
    });

    it("answers the pointer over the item, and settles to the effect's resting look without one", () => {
        expect(
            PlacementItemUtils.computeEffectStyle(
                RECT,
                withEffect(() => ({ x: 0.25, y: 0.5 })),
            )?.transform,
        ).toBe("scale(200%, 200%)");
        expect(
            PlacementItemUtils.computeEffectStyle(
                RECT,
                withEffect(() => undefined),
            )?.transform,
        ).toBe("scale(100%, 100%)");
    });
});
