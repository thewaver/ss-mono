import { describe, expect, it } from "vitest";

import { ShapeConst } from "@thewaver/ss-utils";

import { ShapeLayerUtils } from "./ShapeLayer.utils";

const SQUARE = ShapeConst.getDefaultShapePoints("square", { width: 100, height: 50 });

describe("ShapeLayerUtils.computeGeometry", () => {
    const POINTS = ShapeConst.getDefaultShapePoints("square", { width: 10, height: 10 });

    it("passes bare corners through with the props as they are", () => {
        expect(ShapeLayerUtils.computeGeometry(POINTS, [4], [2], [{ thicknesses: [1], offset: 3 }])).toEqual({
            points: POINTS,
            joinRadii: [4],
            lameExponents: [2],
            strokeGeom: [{ thicknesses: [1], offset: 3 }],
        });
    });

    it("lets a returned list replace its prop, and falls back to the prop for one left out", () => {
        expect(ShapeLayerUtils.computeGeometry({ points: POINTS, joinRadii: [0, 4] }, [4], [2], undefined)).toEqual({
            points: POINTS,
            joinRadii: [0, 4],
            lameExponents: [2],
            strokeGeom: undefined,
        });
    });

    it("replaces each stroke's thicknesses in turn, keeping its offset", () => {
        const geometry = ShapeLayerUtils.computeGeometry(
            { points: POINTS, strokeThicknesses: [[1, 2], [3]] },
            undefined,
            undefined,
            [{ thicknesses: [9], offset: 5 }],
        );

        expect(geometry.strokeGeom).toEqual([{ thicknesses: [1, 2], offset: 5 }, { thicknesses: [3] }]);
    });
});

describe("ShapeLayerUtils.computeLayerPaths", () => {
    it("draws one contour, the shape's own, when there are no strokes", () => {
        const paths = ShapeLayerUtils.computeLayerPaths(SQUARE, undefined, undefined, undefined, undefined);

        expect(paths).toHaveLength(1);
        expect(paths[0].outerPath.startsWith("M ")).toBe(true);
    });

    it("draws one contour per stroke, sharing it between strokes whose geometry agrees", () => {
        const paths = ShapeLayerUtils.computeLayerPaths(
            SQUARE,
            ["a", "b", "c"],
            [{ thicknesses: [4] }, { thicknesses: [4] }, { thicknesses: [2] }],
            undefined,
            undefined,
        );

        expect(paths).toHaveLength(3);
        expect(paths[0]).toBe(paths[1]);
        expect(paths[2]).not.toBe(paths[0]);
    });

    it("stretches a single geometry across every stroke, and stands a zero width in when there is none", () => {
        expect(
            ShapeLayerUtils.computeLayerPaths(SQUARE, ["a", "b"], [{ thicknesses: [4] }], undefined, undefined),
        ).toHaveLength(2);
        expect(ShapeLayerUtils.computeLayerPaths(SQUARE, ["a"], [], undefined, undefined)[0].outerPath).toBe(
            ShapeLayerUtils.computeLayerPaths(SQUARE, undefined, undefined, undefined, undefined)[0].outerPath,
        );
    });
});

describe("ShapeLayerUtils.computeShapeOutside", () => {
    it("wraps content around the contour, and around nothing when too few points enclose nothing", () => {
        expect(
            ShapeLayerUtils.computeShapeOutside([
                { x: 0, y: 0 },
                { x: 10, y: 0 },
                { x: 0, y: 10 },
            ]),
        ).toBe("polygon(0px 0px, 10px 0px, 0px 10px) border-box");
        expect(ShapeLayerUtils.computeShapeOutside([{ x: 0, y: 0 }])).toBeUndefined();
    });
});

describe("ShapeLayerUtils.computePaint", () => {
    it("fills with a flat color or points at the gradient, filter and clip path a record declares", () => {
        expect(ShapeLayerUtils.computePaint({ color: "red", opacity: 0.5 })).toEqual({
            fill: "red",
            fillOpacity: 0.5,
            filter: undefined,
            clipPath: undefined,
            mixBlendMode: undefined,
        });

        const noElement = () => undefined;

        expect(
            ShapeLayerUtils.computePaint({
                gradientOrPattern: { id: "g", renderDefsElement: noElement },
                filter: { id: "f", renderDefsElement: noElement },
                clipPath: { id: "c", renderDefsElement: noElement },
                blend: true,
            }),
        ).toEqual({
            fill: "url(#g)",
            fillOpacity: undefined,
            filter: "url(#f)",
            clipPath: "url(#c)",
            mixBlendMode: "screen",
        });
    });
});
