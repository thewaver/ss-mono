import { ShapeConst, ShapeUtils, type Size2d } from "@thewaver/ss-utils";

import { PointerTrackerUtils } from "../PointerTracker/PointerTracker.utils";
import { SVGFilterDefsFactory } from "../SVG/Defs/Filter/SVGFilterDefs.factory";
import type { SVGDefs } from "../SVG/Defs/SVGDefs.types";
import { DEFAULT_GLASS_DEFS } from "./Glass.const";
import type { GlassDefs, PartialGlassDefs } from "./Glass.types";

/** Stands in for a missing element, so the pointer tracker always has something to call. */
const NO_REF = () => undefined;

/** How far a blur spreads relative to its radius. Three standard deviations covers effectively all of it. */
const BLUR_REACH_RATIO = 3;
/** Asks the shape builder for an outline only, with no stroked edges. */
const NO_EDGE_THICKNESSES = [0];

/**
 * Builds the SVG filters behind the frosted-glass look: a blurred backdrop, a rippled edge and a
 * highlight that follows the pointer.
 *
 * The effect is three things layered up. The backdrop is blurred and pushed around by a turbulence
 * filter, which is what makes the content behind appear to refract. A tinted layer sits over it.
 * And a specular highlight, lit from wherever the pointer is, gives the surface something to catch
 * the light on.
 */
export namespace GlassUtils {
    /**
     * Fills a partial glass description out with the defaults.
     *
     * Merged one group at a time rather than wholesale, so a caller can override a single number — the
     * blur radius, say — without having to restate the rest of that group.
     *
     * @param partial What the caller wants to change. Missing entirely gives the defaults.
     */
    export const mergeDefs = (partial: PartialGlassDefs | undefined): GlassDefs => ({
        noise: { ...DEFAULT_GLASS_DEFS.noise, ...partial?.noise },
        backdrop: { ...DEFAULT_GLASS_DEFS.backdrop, ...partial?.backdrop },
        ripple: { ...DEFAULT_GLASS_DEFS.ripple, ...partial?.ripple },
        tint: { ...DEFAULT_GLASS_DEFS.tint, ...partial?.tint },
        sheen: { ...DEFAULT_GLASS_DEFS.sheen, ...partial?.sheen },
    });

    /**
     * How far beyond its own edges the glass must reach to blur correctly.
     *
     * A blur samples its surroundings, so blurring only the content inside the shape leaves the edges
     * sampling emptiness and fading out. The fix is to draw a larger area and clip it afterwards, and
     * this is how much larger: the blur's own reach, plus however far the ripple can displace a pixel.
     *
     * @param defs The glass description, filled out.
     * @returns The margin in pixels, rounded up so it always covers the effect rather than cutting it
     * fine.
     */
    export const computeBackdropMargin = (defs: GlassDefs) =>
        Math.ceil(defs.backdrop.blurRadius * BLUR_REACH_RATIO + defs.ripple.scale);

    /**
     * Builds the path that clips the over-drawn backdrop back to the glass's real shape.
     *
     * The shape is a superellipse rather than a plain rounded rectangle, which is what gives the
     * corners their continuous curve instead of a circular arc meeting a straight edge.
     *
     * @param size The glass's own size, without the margin.
     * @param margin The margin from {@link GlassUtils.computeBackdropMargin}, which the path is shifted
     * by so it lands over the real shape.
     * @param joinRadii The corner radii, clockwise from the top left.
     * @param lameExponents How square each corner is: `2` is a circular arc, higher is squarer, lower
     * is pointier.
     * @returns The outline as an SVG path.
     */
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

    /**
     * The id of an instance's sheen filter.
     *
     * Filter ids are document-wide, so each instance needs its own or they will overwrite each other.
     */
    export const getSheenFilterId = (id: string) => `glass-sheen-${id}`;

    /** The id of an instance's backdrop filter. */
    export const getBackdropFilterId = (id: string) => `glass-backdrop-${id}`;

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
     * @returns One definition, carrying the tint colour and opacity along with the filter.
     */
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
                        const { getReading } = PointerTrackerUtils.create(getRef ?? NO_REF);

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
     * Turbulence displaces the backdrop rather than colouring it, which is what makes the content
     * behind appear to bend. The displacement is faded towards the edges, so the effect does not tear
     * where it runs out of backdrop to sample.
     *
     * @param id The instance's id, which the filter's own id is built from.
     * @param defs The glass description, filled out.
     */
    export const computeBackdropFilterElement = (id: string, defs: GlassDefs) =>
        new SVGFilterDefsFactory(getBackdropFilterId(id))
            .addTurbulenceFilter({
                baseFrequency: defs.noise.frequency,
                numOctaves: defs.noise.octaves,
                seed: defs.noise.seed,
                scale: defs.ripple.scale,
                edgeFade: defs.ripple.scale,
            })
            .computeFilterPrimitives({ method: "chain" });
}
