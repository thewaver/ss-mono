import { describe, expect, it } from "vitest";

import { CornerUtils } from "./Corners.utils";

describe("CornerUtils", () => {
    it("outlines both arms along the outer edges and back along the inner ones", () => {
        expect(CornerUtils.computeArmPoints({ width: 20, height: 10 }, 4)).toBe("0,0 20,0 16,4 4,4 4,6 0,10");
    });

    it("lights the marks in their own color and transitions both together", () => {
        expect(CornerUtils.computeGlowStyle("red", 200)).toEqual({
            color: "red",
            filter: "drop-shadow(0 0 8px red) drop-shadow(0 0 16px red)",
            transition: "color 200ms, filter 200ms",
        });
    });
});
