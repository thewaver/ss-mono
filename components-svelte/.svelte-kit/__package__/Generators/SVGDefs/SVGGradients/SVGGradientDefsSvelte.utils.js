import { markup } from "../../../Utils/markupUtils.js";
import SVGLinearGradient from "./SVGLinearGradient.svelte";
import SVGRadialGradient from "./SVGRadialGradient.svelte";
/**
 * The Svelte side of `SVGGradientDefsUtils`: `linearGradient` and `radialGradient` elements, with the stops worked
 * out from the colors, held as markup.
 *
 * Each call answers the gradient as it stands. Drawn again with a new answer — as a `Shape` does when its size
 * changes — the element stays in place and its attributes follow the new angle or colors.
 */
export var SVGGradientDefsSvelteUtils;
(function (SVGGradientDefsSvelteUtils) {
    /**
     * Builds a linear gradient.
     *
     * @param defs The gradient: its id, the `angle` it runs at, an `offset` and `scale` for shifting and shortening
     * it, the `colors`, and `spreadKind` — `"banded"` for hard-edged bands, anything else for a smooth blend.
     * Remaining properties are passed to the element.
     * @param custom Extra content to place inside the gradient before the stops, for animating it. Given as a
     * function, it receives the gradient's endpoints.
     * @returns The `linearGradient` element as markup, which a fill points at with `url(#…)`.
     */
    SVGGradientDefsSvelteUtils.computeLinearGradient = (defs, custom) => markup(SVGLinearGradient, { defs, custom });
    /**
     * Builds a radial gradient.
     *
     * @param defs The gradient: its id, the `colors`, an `origin` to radiate from, a `scale` for its radius, and
     * `aspect` and `angle` for squashing and turning it into an ellipse. `elementSize` holds the gradient round on an
     * oblong element rather than letting it follow the box. `spreadKind` is `"banded"` for hard-edged rings, anything
     * else for a smooth blend. Remaining properties are passed to the element.
     * @param custom Extra content to place inside the gradient before the stops, for animating it. Given as a
     * function, it receives the gradient's center and radius.
     * @returns The `radialGradient` element as markup, which a fill points at with `url(#…)`.
     */
    SVGGradientDefsSvelteUtils.computeRadialGradient = (defs, custom) => markup(SVGRadialGradient, { defs, custom });
})(SVGGradientDefsSvelteUtils || (SVGGradientDefsSvelteUtils = {}));
