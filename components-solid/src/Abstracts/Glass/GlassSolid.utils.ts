import { type GlassDefs, type GlassTintDefs, GlassUtils } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../Generators/SVGDefs/SVGDefsSolid.types";
import { SVGFilterDefsFactory } from "../../Generators/SVGDefs/SVGFilters/SVGFilterDefs.factory";
import { SVGGradientDefsSolidUtils } from "../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSolid.utils";
import { PointerTrackerSolidUtils } from "../PointerTracker/PointerTrackerSolid.utils";

/** Stands in for a missing element, so the pointer tracker always has something to call. */
const NO_REF = () => undefined;

/**
 * Builds the tint's fill: a flat color, or a gradient built the same way the SVG defs factories
 * build one anywhere else in the library.
 *
 * @param id The instance's id, which the gradient's own id is built from.
 * @param getSize The element's current size, which a radial gradient's `elementSize` needs to hold
 * its shape on a non-square element.
 * @param tint The tint half of the glass description.
 */
const computeTintFill = (id: string, getSize: () => Size2d, tint: GlassTintDefs) => {
    const gradient = tint.gradient;

    if (!gradient) return { color: tint.color };

    const gradientId = GlassUtils.getTintGradientId(id);

    return {
        gradientOrPattern: {
            id: gradientId,
            renderDefsElement: () =>
                gradient.kind === "linear"
                    ? SVGGradientDefsSolidUtils.computeLinearGradient({ ...gradient, id: gradientId })
                    : SVGGradientDefsSolidUtils.computeRadialGradient({
                          ...gradient,
                          id: gradientId,
                          elementSize: getSize,
                      }),
        },
    };
};

/**
 * The Solid side of {@link GlassUtils}: the SVG filters behind the frosted-glass look, built as Solid markup — a
 * blurred backdrop, a rippled edge and a highlight that follows the pointer. The geometry and the ids are
 * framework-free.
 */
export namespace GlassSolidUtils {
    /**
     * Builds the pointer-tracking highlight.
     *
     * The light source is a point light placed over the element wherever the pointer is, so the
     * highlight slides across the surface as the pointer moves and the glass reads as curved. The
     * surface it lights is fractal noise rather than a flat plane, which is what stops the highlight
     * looking like a clean gradient.
     *
     * @param id The instance's id, which the filter's own id is built from.
     * @param getRef The element the pointer is tracked over. Without one the highlight sits wherever
     * the tracker's resting position is.
     * @param getSize The element's current size, which the pointer's position is scaled against.
     * @param defs The glass description, filled out.
     * @returns One definition, carrying the tint's fill and opacity along with the filter. The filter
     * is left off entirely at a `specularConstant` of zero, rather than pointed at one that builds
     * nothing — the same trap `computeBackdropFilterElement`'s callers have to account for.
     */
    export const computeSheenDefs = (
        id: string,
        getRef: (() => HTMLElement | undefined) | undefined,
        getSize: () => Size2d,
        defs: GlassDefs,
    ): SVGDefs[] => {
        const tintDef = { ...computeTintFill(id, getSize, defs.tint), opacity: defs.tint.opacity };

        if (defs.sheen.specularConstant <= 0) return [tintDef];

        const filterId = GlassUtils.getSheenFilterId(id);

        return [
            {
                ...tintDef,
                filter: {
                    id: filterId,
                    renderDefsElement: () => {
                        const { getReading } = PointerTrackerSolidUtils.create(getRef ?? NO_REF);

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
                                    baseFrequency: defs.noise.frequency,
                                    numOctaves: defs.noise.octaves,
                                    seed: defs.noise.seed,
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

    /**
     * Builds the refraction applied to whatever is behind the glass.
     *
     * Turbulence displaces the backdrop rather than coloring it, which is what makes the content
     * behind appear to bend. The displacement is faded towards the edges, so the effect does not tear
     * where it runs out of backdrop to sample.
     *
     * @param id The instance's id, which the filter's own id is built from.
     * @param defs The glass description, filled out.
     */
    export const computeBackdropFilterElement = (id: string, defs: GlassDefs) =>
        new SVGFilterDefsFactory(GlassUtils.getBackdropFilterId(id))
            .addTurbulenceFilter({
                baseFrequency: defs.noise.frequency,
                numOctaves: defs.noise.octaves,
                seed: defs.noise.seed,
                scale: defs.ripple.scale,
                edgeFade: defs.ripple.scale,
            })
            .computeFilterPrimitives({ method: "chain" });
}
