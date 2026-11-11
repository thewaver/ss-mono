import { SVGStyleDefsUtils, type SVGStylePaint, type SVGStyleSource } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import { markup } from "../../../Utils/markupUtils.js";
import type { SVGDefs } from "../SVGDefs.types.js";
import { SVGGradientDefsSvelteUtils } from "../SVGGradients/SVGGradientDefsSvelte.utils.js";
import SVGStyleClip from "./SVGStyleClip.svelte";
import SVGStyleShadow from "./SVGStyleShadow.svelte";
import SVGStyleTile from "./SVGStyleTile.svelte";

const SHADOW_SOURCE_COLOR = "black";

const computePaintDefs = (paint: SVGStylePaint): SVGDefs => {
    if (paint.kind === "shadow") {
        return {
            color: SHADOW_SOURCE_COLOR,
            filter: { id: paint.shadow.id, renderDefsElement: () => markup(SVGStyleShadow, { shadow: paint.shadow }) },
        };
    }

    if (paint.kind === "tile") {
        return {
            gradientOrPattern: {
                id: paint.tile.id,
                renderDefsElement: () => markup(SVGStyleTile, { tile: paint.tile, gradient: paint.gradient }),
            },
        };
    }

    if (paint.kind === "color") {
        const clip = paint.clip;

        return {
            color: paint.color,
            clipPath: clip && { id: clip.id, renderDefsElement: () => markup(SVGStyleClip, { clip }) },
        };
    }

    return {
        gradientOrPattern: {
            id: paint.gradient.id,
            renderDefsElement: () =>
                paint.kind === "linear_gradient"
                    ? SVGGradientDefsSvelteUtils.computeLinearGradient(paint.gradient)
                    : SVGGradientDefsSvelteUtils.computeRadialGradient(paint.gradient),
        },
    };
};

/** The Svelte side of `SVGStyleDefsUtils`: its descriptions, as the defs records `Shape` paints with. */
export namespace SVGStyleDefsSvelteUtils {
    /**
     * Converts a computed style into the fill and stroke defs of a `Shape`.
     *
     * See `SVGStyleDefsUtils.computeDefsFromStyle` for what is converted and what is skipped with a warning.
     *
     * @param style The computed style, as `getComputedStyle` returns it.
     * @param size The size of the box being painted.
     * @param id Prefix for the gradient and clip ids, unique in the document.
     * @returns `fillDefs` and `strokeDefs` for `computeFillDefs` and `computeStrokeDefs`, plus `fillGeom`,
     * `strokeGeom`, `joinRadii` and `lameExponents` for the props of those names.
     */
    export const computeDefsFromStyle = (style: SVGStyleSource, size: Size2d, id: string) => {
        const defs = SVGStyleDefsUtils.computeDefsFromStyle(style, size, id);

        return {
            fillDefs: defs.fill.map(computePaintDefs),
            fillGeom: defs.fillGeom,
            strokeDefs: defs.stroke.map(computePaintDefs),
            strokeGeom: defs.strokeGeom,
            joinRadii: defs.joinRadii,
            lameExponents: defs.lameExponents,
        };
    };
}
