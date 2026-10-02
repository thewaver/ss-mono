import { describe, expect, it } from "vitest";

import { PaintedTextUtils } from "./PaintedText.utils";

describe("computeStrokePaint", () => {
    it("draws a centered stroke at the width asked for, unmasked", () => {
        expect(PaintedTextUtils.computeStrokePaint("center", 3)).toEqual({ drawnWidth: 3, maskKind: undefined });
    });

    it("draws an outside or inside stroke twice as wide and masks half of it away", () => {
        expect(PaintedTextUtils.computeStrokePaint("outside", 3)).toEqual({ drawnWidth: 6, maskKind: "outside" });
        expect(PaintedTextUtils.computeStrokePaint("inside", 3)).toEqual({ drawnWidth: 6, maskKind: "inside" });
    });
});

describe("resolveFillDefs", () => {
    const fill = [{ color: "red" }];
    const stroke = [{ color: "blue" }];

    it("keeps the consumer's fill", () => {
        expect(PaintedTextUtils.resolveFillDefs(fill, stroke)).toBe(fill);
    });

    it("draws no fill when only a stroke is asked for, which leaves the letters hollow", () => {
        expect(PaintedTextUtils.resolveFillDefs(undefined, stroke)).toEqual([]);
    });

    it("falls back to the text color when there is no paint at all", () => {
        expect(PaintedTextUtils.resolveFillDefs(undefined, undefined)).toEqual([{ color: "currentColor" }]);
        expect(PaintedTextUtils.resolveFillDefs(undefined, [])).toEqual([{ color: "currentColor" }]);
        expect(PaintedTextUtils.resolveFillDefs([], [])).toEqual([{ color: "currentColor" }]);
    });
});

describe("getIsReadableLayer", () => {
    it("reads the first fill", () => {
        expect(PaintedTextUtils.getIsReadableLayer("fill", 0, 2)).toBe(true);
        expect(PaintedTextUtils.getIsReadableLayer("fill", 1, 2)).toBe(false);
        expect(PaintedTextUtils.getIsReadableLayer("stroke", 0, 2)).toBe(false);
    });

    it("reads the first stroke when there is no fill", () => {
        expect(PaintedTextUtils.getIsReadableLayer("stroke", 0, 0)).toBe(true);
        expect(PaintedTextUtils.getIsReadableLayer("stroke", 1, 0)).toBe(false);
    });
});
