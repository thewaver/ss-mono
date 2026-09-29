import { describe, expect, it } from "vitest";

import type { EdgeFaderMetrics } from "./EdgeFader.types";
import { EdgeFaderUtils } from "./EdgeFader.utils";

const AT_TOP: EdgeFaderMetrics = {
    remaining: { top: 0, right: 0, bottom: 300, left: 0 },
    gutterWidth: 0,
    gutterHeight: 0,
};

describe("EdgeFaderUtils.getIsScrollable", () => {
    it("is scrollable when any side has distance left", () => {
        expect(EdgeFaderUtils.getIsScrollable(AT_TOP)).toBe(true);
        expect(EdgeFaderUtils.getIsScrollable(EdgeFaderUtils.NO_METRICS)).toBe(false);
    });
});

describe("EdgeFaderUtils.computeMaskStyle", () => {
    it("draws no mask when no side is chosen", () => {
        expect(
            EdgeFaderUtils.computeMaskStyle({ edges: [], size: 40, isScrollAware: false, metrics: AT_TOP }).maskImage,
        ).toBe("none");
    });

    it("fades each chosen side by the full size when fixed", () => {
        const style = EdgeFaderUtils.computeMaskStyle({
            edges: ["top", "bottom"],
            size: 40,
            isScrollAware: false,
            metrics: AT_TOP,
        });

        expect(style.maskImage).toContain("to bottom, transparent, #000 40px, #000 calc(100% - 40px)");
        expect(style.maskImage, "only the vertical axis").not.toContain("to right");
    });

    it("fades a scroll-aware side by the lesser of the size and the distance left", () => {
        const style = EdgeFaderUtils.computeMaskStyle({
            edges: ["top", "bottom"],
            size: 40,
            isScrollAware: true,
            metrics: { ...AT_TOP, remaining: { top: 12, right: 0, bottom: 300, left: 0 } },
        });

        expect(style.maskImage).toContain("#000 12px, #000 calc(100% - 40px)");
    });

    it("keeps both scrollbar strips out of the fade, and intersects the two axes", () => {
        const style = EdgeFaderUtils.computeMaskStyle({
            edges: ["top", "right", "bottom", "left"],
            size: 40,
            isScrollAware: false,
            metrics: { ...AT_TOP, gutterWidth: 15, gutterHeight: 10 },
        });

        expect(style.maskSize.split(", ").slice(0, 2)).toEqual(["15px 100%", "100% 10px"]);
        expect(style.maskComposite).toBe("add, add, intersect, add");
    });
});
