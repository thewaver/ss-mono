import { ShapeConst, ShapeUtils, type Size2d } from "@thewaver/ss-utils";

import { PointerTracker } from "../PointerTracker/PointerTracker";
import { SVGFilterDefsFactory } from "../SVG/Defs/Filter/SVGFilterDefs.factory";
import type { SVGDefs } from "../SVG/Defs/SVGDefs.types";
import { DEFAULT_GLASS_DEFS } from "./Glass.const";
import type { GlassDefs, PartialGlassDefs } from "./Glass.types";

const NO_REF = () => undefined;

const BLUR_REACH_RATIO = 3;
const NO_EDGE_THICKNESSES = [0];

export namespace GlassUtils {
    export const mergeDefs = (partial: PartialGlassDefs | undefined): GlassDefs => ({
        backdrop: { ...DEFAULT_GLASS_DEFS.backdrop, ...partial?.backdrop },
        ripple: { ...DEFAULT_GLASS_DEFS.ripple, ...partial?.ripple },
        tint: { ...DEFAULT_GLASS_DEFS.tint, ...partial?.tint },
        sheen: { ...DEFAULT_GLASS_DEFS.sheen, ...partial?.sheen },
    });

    export const computeBackdropMargin = (defs: GlassDefs) =>
        Math.ceil(defs.backdrop.blurRadius * BLUR_REACH_RATIO + defs.ripple.scale);

    export const computeMarginedClipPath = (
        size: Size2d,
        margin: number,
        joinRadii: number[],
        lameExponents: number[],
    ) => {
        const points = ShapeConst.getDefaultShapePoints("square", size).map((point) => ({
            x: point.x + margin,
            y: point.y + margin,
        }));

        return ShapeUtils.getPaths(points, NO_EDGE_THICKNESSES, joinRadii, lameExponents).outerPath;
    };

    export const getSheenFilterId = (id: string) => `glass-sheen-${id}`;

    export const getBackdropFilterId = (id: string) => `glass-backdrop-${id}`;

    export const computeSheenDefs = (
        id: string,
        getRef: (() => HTMLElement | undefined) | undefined,
        getSize: () => Size2d,
        defs: GlassDefs,
    ): SVGDefs[] => {
        const filterId = getSheenFilterId(id);

        return [
            {
                color: defs.tint.color,
                opacity: defs.tint.opacity,
                filter: {
                    id: filterId,
                    renderDefsElement: () => {
                        const { getReading } = PointerTracker.create(getRef ?? NO_REF);

                        const getSpot = () => {
                            const size = getSize();
                            const ratio = getReading().boxRatio;

                            return { x: ratio.x * size.width, y: ratio.y * size.height };
                        };

                        return new SVGFilterDefsFactory(filterId)
                            .addSpecularLightingFilter({
                                light: {
                                    kind: "point",
                                    x: () => getSpot().x,
                                    y: () => getSpot().y,
                                    z: defs.sheen.lightHeight,
                                },
                                surface: {
                                    baseFrequency: defs.sheen.grainFrequency,
                                    numOctaves: defs.sheen.grainOctaves,
                                    seed: defs.sheen.grainSeed,
                                },
                                surfaceScale: defs.sheen.surfaceScale,
                                specularConstant: defs.sheen.specularConstant,
                                specularExponent: defs.sheen.specularExponent,
                                lightingColor: "#FFFFFF",
                            })
                            .computeFilterPrimitives({ method: "chain", elementSize: getSize() });
                    },
                },
            },
        ];
    };

    export const computeBackdropFilterElement = (id: string, defs: GlassDefs) =>
        new SVGFilterDefsFactory(getBackdropFilterId(id))
            .addTurbulenceFilter({
                baseFrequency: defs.ripple.frequency,
                numOctaves: defs.ripple.octaves,
                seed: defs.ripple.seed,
                scale: defs.ripple.scale,
                edgeFade: defs.ripple.scale,
            })
            .computeFilterPrimitives({ method: "chain" });
}
