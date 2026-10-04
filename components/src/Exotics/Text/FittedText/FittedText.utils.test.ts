import { describe, expect, it } from "vitest";

import { FittedTextUtils } from "./FittedText.utils";

const METRICS = { "font-family": "sans-serif", "font-size": "100px" };

describe("FittedTextUtils.computeFontSizes", () => {
    it("answers zeroes for a box with no area, so nothing is drawn before it is measured", () => {
        expect(FittedTextUtils.computeFontSizes(["a", "bb"], METRICS, { width: 0, height: 100 }, 1)).toEqual([0, 0]);
    });

    it("answers one size per line", () => {
        expect(
            FittedTextUtils.computeFontSizes(["a", "bb", "ccc"], METRICS, { width: 300, height: 300 }, 1),
        ).toHaveLength(3);
    });
});
