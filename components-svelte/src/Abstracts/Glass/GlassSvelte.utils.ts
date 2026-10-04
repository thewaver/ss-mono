import { type GlassDefs, type GlassTintDefs, GlassUtils, type PointSource } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../Generators/SVGDefs/SVGDefs.types.js";
import { SVGFilterDefsFactory } from "../../Generators/SVGDefs/SVGFilters/SVGFilterDefs.factory.js";
import { SVGGradientDefsSvelteUtils } from "../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSvelte.utils.js";
import { markup } from "../../Utils/markupUtils.js";
import GlassSheenFilter from "./GlassSheenFilter.svelte";

const computeTintFill = (id: string, size: Size2d, tint: GlassTintDefs) => {
    const gradient = tint.gradient;

    if (!gradient) return { color: tint.color };

    const gradientId = GlassUtils.getTintGradientId(id);

    return {
        gradientOrPattern: {
            id: gradientId,
            renderDefsElement: () =>
                gradient.kind === "linear"
                    ? SVGGradientDefsSvelteUtils.computeLinearGradient({ ...gradient, id: gradientId })
                    : SVGGradientDefsSvelteUtils.computeRadialGradient({
                          ...gradient,
                          id: gradientId,
                          elementSize: size,
                      }),
        },
    };
};

/**
 * The Svelte side of {@link GlassUtils}: the SVG filters behind the frosted-glass look, built as Svelte markup — a
 * blurred backdrop, a rippled edge and a highlight that follows the pointer. The geometry and the ids are
 * framework-free.
 */
export namespace GlassSvelteUtils {
    /**
     * Builds the pointer-tracking highlight.
     *
     * The light source is a point light placed over the element wherever the pointer is, so the highlight slides
     * across the surface as the pointer moves and the glass reads as curved. The surface it lights is fractal noise
     * rather than a flat plane, which is what stops the highlight looking like a clean gradient. The filter is a
     * component of its own that follows the pointer, so a pointer move redraws the filter and nothing around it.
     *
     * @param id The instance's id, which the filter's own id is built from.
     * @param element The element the pointer is tracked over. Without one the highlight sits wherever the tracker's
     * resting position is.
     * @param size The element's current size, which the pointer's position is scaled against.
     * @param defs The glass description, filled out.
     * @param getSource The point the light follows in place of the pointer. Left out, or answering `undefined`, the
     * pointer.
     * @returns One definition, carrying the tint's fill and opacity along with the filter. The filter is left off
     * entirely at a `specularConstant` of zero, rather than pointed at one that builds nothing.
     */
    export const computeSheenDefs = (
        id: string,
        element: HTMLElement | undefined,
        size: Size2d,
        defs: GlassDefs,
        getSource?: () => PointSource | undefined,
    ): SVGDefs[] => {
        const tintDef = { ...computeTintFill(id, size, defs.tint), opacity: defs.tint.opacity };

        if (defs.sheen.specularConstant <= 0) return [tintDef];

        const filterId = GlassUtils.getSheenFilterId(id);

        return [
            {
                ...tintDef,
                filter: {
                    id: filterId,
                    renderDefsElement: () =>
                        markup(GlassSheenFilter, { filterId, element, size, defs, getPointSource: getSource }),
                },
            },
        ];
    };

    /**
     * Builds the refraction applied to whatever is behind the glass.
     *
     * Turbulence displaces the backdrop rather than coloring it, which is what makes the content behind appear to
     * bend. The displacement is faded towards the edges, so the effect does not tear where it runs out of backdrop to
     * sample.
     *
     * @param id The instance's id, which the filter's own id is built from.
     * @param defs The glass description, filled out.
     * @returns The `filter` element as markup, or `undefined` when the ripple's scale is zero and there is nothing to
     * build.
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
