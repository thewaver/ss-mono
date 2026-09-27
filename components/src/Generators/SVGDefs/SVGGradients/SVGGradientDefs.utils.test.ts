import { describe, expect, it } from "vitest";

import { SVGGradientDefsUtils } from "./SVGGradientDefs.utils";

describe("SVGGradientDefsUtils", () => {
    it("spreads unpinned colors evenly between the pinned ones and the ends", () => {
        expect(SVGGradientDefsUtils.resolveStops([{ value: "a" }, { value: "b" }, { value: "c" }])).toEqual([
            0, 50, 100,
        ]);
        expect(
            SVGGradientDefsUtils.resolveStops([
                { value: "a" },
                { value: "b" },
                { value: "c", stop: 40 },
                { value: "d" },
            ]),
        ).toEqual([0, 20, 40, 100]);
    });

    it("gives a smooth gradient one stop per color", () => {
        expect(SVGGradientDefsUtils.computeStops("g", [{ value: "a" }, { value: "b" }], "smooth")).toEqual([
            { id: "g-stop-0", offset: "0%", color: "a" },
            { id: "g-stop-1", offset: "100%", color: "b" },
        ]);
    });

    it("gives a banded gradient a closing and an opening stop at every boundary", () => {
        expect(
            SVGGradientDefsUtils.computeStops(
                "g",
                [{ value: "a" }, { value: "b", stop: 50 }, { value: "c" }],
                "banded",
            ),
        ).toEqual([
            { id: "g-stop-0-start", offset: "0%", color: "a" },
            { id: "g-stop-0-end", offset: "50%", color: "a" },
            { id: "g-stop-1-start", offset: "50%", color: "b" },
            { id: "g-stop-1-end", offset: "100%", color: "b" },
            { id: "g-stop-2-start", offset: "100%", color: "c" },
        ]);
    });

    it("centers a radial gradient in the middle at half the box, untransformed, unless told otherwise", () => {
        expect(SVGGradientDefsUtils.computeRadialGeometry({})).toEqual({
            cx: 0.5,
            cy: 0.5,
            r: 0.5,
            gradientTransform: undefined,
        });
        expect(SVGGradientDefsUtils.computeRadialGeometry({ origin: { x: 0.2, y: 0.8 }, scale: 3 })).toMatchObject({
            cx: 0.2,
            cy: 0.8,
            r: 1.5,
        });
    });
});
