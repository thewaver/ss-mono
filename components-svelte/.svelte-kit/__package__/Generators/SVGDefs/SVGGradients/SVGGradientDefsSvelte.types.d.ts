import type { SVGLinearGradientDefs, SVGRadialGradientDefs } from "@thewaver/ss-components";
import type { SvelteMarkup } from "../../../Utils/typeUtils.js";
export type SVGLinearGradientProps = {
    /**
     * The gradient: its id, the `angle` it runs at, an `offset` and `scale` for shifting and shortening it, the
     * `colors`, and `spreadKind` — `"banded"` for hard-edged bands, anything else for a smooth blend. Remaining
     * properties are passed to the element.
     */
    defs: SVGLinearGradientDefs;
    /**
     * Extra content to place inside the gradient before the stops, for animating it. Given as a function, it receives
     * the gradient's endpoints.
     */
    custom?: SvelteMarkup | ((x1: number, y1: number, x2: number, y2: number) => SvelteMarkup);
};
export type SVGRadialGradientProps = {
    /**
     * The gradient: its id, the `colors`, an `origin` to radiate from, a `scale` for its radius, and `aspect` and
     * `angle` for squashing and turning it into an ellipse. `elementSize` holds the gradient round on an oblong
     * element rather than letting it follow the box. `spreadKind` is `"banded"` for hard-edged rings, anything else
     * for a smooth blend. Remaining properties are passed to the element.
     */
    defs: SVGRadialGradientDefs;
    /**
     * Extra content to place inside the gradient before the stops, for animating it. Given as a function, it receives
     * the gradient's center and radius.
     */
    custom?: SvelteMarkup | ((cx: number, cy: number, r: number) => SvelteMarkup);
};
