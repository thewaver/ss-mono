import { describe, expect, it } from "vitest";

import { CSSUtils, ShapeConst } from "@thewaver/ss-utils";

import { SurfaceUtils } from "./Surface.utils";

const noElement = () => undefined;

describe("SurfaceUtils.getIsComplex", () => {
    it("keeps flat colors and round corners on the div path", () => {
        expect(SurfaceUtils.getIsComplex([{ color: "red" }], [{ color: "blue", opacity: 0.5 }], undefined)).toBe(false);
        expect(
            SurfaceUtils.getIsComplex(
                undefined,
                undefined,
                CSSUtils.spreadCornerShape(ShapeConst.CORNER_SHAPE_LAME_EXPONENTS.round),
            ),
        ).toBe(false);
    });

    it("takes the SVG path for a gradient, a filter, a blend or a corner that is not round", () => {
        expect(
            SurfaceUtils.getIsComplex(
                undefined,
                [{ gradientOrPattern: { id: "g", renderDefsElement: noElement } }],
                undefined,
            ),
        ).toBe(true);
        expect(SurfaceUtils.getIsComplex([{ color: "red", blend: true }], undefined, undefined)).toBe(true);
        expect(
            SurfaceUtils.getIsComplex(
                undefined,
                undefined,
                CSSUtils.spreadCornerShape(ShapeConst.CORNER_SHAPE_LAME_EXPONENTS.squircle),
            ),
        ).toBe(true);
    });
});

describe("SurfaceUtils on the div path", () => {
    it("draws a border only in a color and only where some side has width", () => {
        const stroke = SurfaceUtils.findColorDef([
            { gradientOrPattern: { id: "g", renderDefsElement: noElement } },
            { color: "red" },
        ]);

        expect(stroke?.color).toBe("red");
        expect(SurfaceUtils.getHasBorder(stroke, CSSUtils.spreadWidth(2))).toBe(true);
        expect(SurfaceUtils.getHasBorder(stroke, CSSUtils.spreadWidth(0))).toBe(false);
        expect(SurfaceUtils.getHasBorder(undefined, CSSUtils.spreadWidth(2))).toBe(false);
    });

    it("reads a missing opacity as fully opaque", () => {
        expect(SurfaceUtils.computeOpacityPercent(undefined)).toBe("100%");
        expect(SurfaceUtils.computeOpacityPercent({ color: "red", opacity: 0.25 })).toBe("25%");
    });
});

describe("SurfaceUtils clockwise lists", () => {
    it("reads the corners from the top left and the sides from the top, clockwise", () => {
        expect(
            SurfaceUtils.computeJoinRadii({
                borderTopLeftRadius: 1,
                borderTopRightRadius: 2,
                borderBottomRightRadius: 3,
                borderBottomLeftRadius: 4,
            }),
        ).toEqual([1, 2, 3, 4]);
        expect(
            SurfaceUtils.computeBorderWidths({
                borderTopWidth: 1,
                borderRightWidth: 2,
                borderBottomWidth: 3,
                borderLeftWidth: 4,
            }),
        ).toEqual([1, 2, 3, 4]);
    });

    it("gives no width and plain round corners when nothing is named", () => {
        expect(SurfaceUtils.computeBorderWidths(undefined)).toEqual([0]);
        expect(SurfaceUtils.computeLameExponents(undefined)).toEqual([ShapeConst.CORNER_SHAPE_LAME_EXPONENTS.round]);
    });
});
