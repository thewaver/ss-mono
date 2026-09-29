import { ShapeConst, ShapeUtils, type Size2d } from "@thewaver/ss-utils";

import { DEFAULT_GLASS_DEFS } from "./Glass.const";
import type { GlassDefs, PartialGlassDefs } from "./Glass.types";

/** How far a blur spreads relative to its radius. Three standard deviations covers effectively all of it. */
const BLUR_REACH_RATIO = 3;
/** Asks the shape builder for an outline only, with no stroked edges. */
const NO_EDGE_THICKNESSES = [0];

/** Builds the id of an instance's tint gradient. Published as {@link GlassUtils.getTintGradientId}. */
const computeTintGradientId = (id: string) => `glass-tint-${id}`;

/**
 * The measurements and names behind the frosted-glass look: its filled-out description, how far the backdrop has
 * to be over-drawn to blur cleanly, the path that clips it back, and the ids its filters and gradient go by.
 *
 * The effect is three things layered up. The backdrop is blurred and pushed around by a turbulence
 * filter, which is what makes the content behind appear to refract. A tinted layer sits over it.
 * And a specular highlight, lit from wherever the pointer is, gives the surface something to catch
 * the light on. Building those filters is markup, and is each framework's.
 */
export namespace GlassUtils {
    /**
     * Fills a partial glass description out with the defaults.
     *
     * Merged one group at a time rather than wholesale, so a caller can override a single number — the
     * blur radius, say — without having to restate the rest of that group. `tint` is the exception: a
     * flat color and a gradient are different shapes, not a wider set of the same fields, so a caller
     * who supplies one replaces the default entirely rather than having it blended in field by field.
     *
     * @param partial What the caller wants to change. Missing entirely gives the defaults.
     */
    export const mergeDefs = (partial: PartialGlassDefs | undefined): GlassDefs => ({
        noise: { ...DEFAULT_GLASS_DEFS.noise, ...partial?.noise },
        backdrop: { ...DEFAULT_GLASS_DEFS.backdrop, ...partial?.backdrop },
        ripple: { ...DEFAULT_GLASS_DEFS.ripple, ...partial?.ripple },
        tint: partial?.tint ?? DEFAULT_GLASS_DEFS.tint,
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

    /** The id of an instance's tint gradient, when the tint is a gradient rather than a flat color. */
    export const getTintGradientId = computeTintGradientId;
}
