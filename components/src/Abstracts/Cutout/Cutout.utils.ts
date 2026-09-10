import type { JSX } from "solid-js";

import type { CutoutHole } from "./Cutout.types";

const FULL_COVERAGE_LAYER = "linear-gradient(black, black)";
const KEEP_OUTSIDE_HOLES = "subtract";
const JOIN_WITH_OTHER_HOLES = "add";

/** Builds the CSS mask that punches transparent holes through an otherwise solid element. */
export namespace CutoutUtils {
    /**
     * Turns a list of holes into the mask properties that cut them out of an element.
     *
     * The mask is stacked: a layer covering the whole element first, then one layer per hole which
     * is subtracted from it. The result is an element painted everywhere except where the holes
     * are, which is how a spotlight or an onboarding overlay lets the thing underneath show
     * through.
     *
     * Every property is written twice, once plain and once `-webkit-` prefixed, because Safari
     * still needs the prefixed spelling.
     *
     * @param holes Where to cut, in pixels relative to the element's own top-left corner. A hole
     * may carry an `image` to soften its shape — a radial gradient gives a faded edge; without one
     * it is cut as a hard rectangle.
     * @returns Style properties to spread onto the element. An empty list gives a mask that covers
     * everything, so the element paints as it normally would.
     */
    export const getMaskStyle = (holes: CutoutHole[]): JSX.CSSProperties => {
        const images = [FULL_COVERAGE_LAYER, ...holes.map((hole) => hole.image ?? FULL_COVERAGE_LAYER)].join(", ");
        const positions = ["0 0", ...holes.map((hole) => `${hole.x}px ${hole.y}px`)].join(", ");
        const sizes = ["auto", ...holes.map((hole) => `${hole.width}px ${hole.height}px`)].join(", ");
        const composites = [KEEP_OUTSIDE_HOLES, ...holes.map(() => JOIN_WITH_OTHER_HOLES)].join(", ");

        return {
            "mask-image": images,
            "-webkit-mask-image": images,
            "mask-position": positions,
            "-webkit-mask-position": positions,
            "mask-size": sizes,
            "-webkit-mask-size": sizes,
            "mask-repeat": "no-repeat",
            "-webkit-mask-repeat": "no-repeat",
            "mask-composite": composites,
        };
    };
}
