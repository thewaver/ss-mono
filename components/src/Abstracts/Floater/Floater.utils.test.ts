import { describe, expect, it } from "vitest";

import type { PlacementLayout } from "../Placement/Placement.types";
import { FloaterUtils } from "./Floater.utils";

const PLACEMENT = { leftShare: 0.5, topShare: 0.25, widthShare: 0.2, heightShare: 0.1, angle: 30 };

describe("computePlacedBounds", () => {
    it("starts the box half its size back from the placement's center, in shares of the width", () => {
        expect(FloaterUtils.computePlacedBounds(PLACEMENT)).toEqual({
            top: "20cqw",
            left: "40cqw",
            width: "20cqw",
            height: "10cqw",
            transform: "rotate(30deg)",
        });
    });
});

describe("resolveBounds", () => {
    const layout = { heightRatio: 0.5, placements: [PLACEMENT] } as unknown as PlacementLayout;

    it("uses the measurement for a plain control and the placement for a laid-out one", () => {
        const measured = { top: "1px", left: "2px", width: "3px", height: "4px" };

        expect(FloaterUtils.resolveBounds(undefined, measured, undefined)).toBe(measured);
        expect(FloaterUtils.resolveBounds(layout, measured, undefined)).toBeUndefined();
        expect(FloaterUtils.resolveBounds(layout, measured, PLACEMENT)?.transform).toBe("rotate(30deg)");
    });
});
