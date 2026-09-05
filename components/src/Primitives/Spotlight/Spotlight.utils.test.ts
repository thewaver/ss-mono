import { describe, expect, it } from "vitest";

import type { Rect } from "@thewaver/ss-utils";

import { SpotlightUtils } from "./Spotlight.utils";

const RECT: Rect = { x: 100, y: 50, width: 200, height: 80 };

describe("getHoleClipPath", () => {
    it("traces the whole layer and then the hole, so the hole is what is cut away", () => {
        expect(SpotlightUtils.getHoleClipPath(RECT)).toBe(
            "polygon(evenodd, 0 0, 0 100%, 100% 100%, 100% 0, 0 0, " +
                "100px 50px, 300px 50px, 300px 130px, 100px 130px, 100px 50px, 0 0)",
        );
    });

    it("measures the outer ring against the layer rather than a known size", () => {
        expect(SpotlightUtils.getHoleClipPath(RECT), "so it fills whatever the viewport is").toContain(
            "0 0, 0 100%, 100% 100%, 100% 0",
        );
    });

    it("collapses to a hole of nothing for a rect with no size", () => {
        const path = SpotlightUtils.getHoleClipPath({ x: 0, y: 0, width: 0, height: 0 });

        expect(path, "every hole corner lands on the same point, so nothing is cut").toBe(
            "polygon(evenodd, 0 0, 0 100%, 100% 100%, 100% 0, 0 0, 0px 0px, 0px 0px, 0px 0px, 0px 0px, 0px 0px, 0 0)",
        );
    });
});
