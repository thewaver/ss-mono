import type { Point2d } from "@thewaver/ss-utils";

import type { LensCopyStyle, LensLayerStyle } from "./Lens.types";

const HIDDEN_LAYER: LensLayerStyle = { visibility: "hidden" };
const NO_REPEAT = "no-repeat";

/**
 * How a lens shows its magnified copy: the window the copy is seen through, and the scale that keeps the spot under
 * the lens where it is.
 *
 * Everything a lens shares with a reveal — where the window is, when it is open, the shape of it and how the arrow
 * keys move it — is `RevealUtils`'; these answer only what a lens adds on top.
 */
export namespace LensUtils {
    /**
     * The style of the layer holding the magnified copy: a mask that shows it only inside the lens, or nothing at all.
     *
     * The mask is the lens's own image placed once, so everything outside it is transparent and the content
     * underneath shows through untouched.
     *
     * @param hasLens Whether the lens is drawn at all, from `RevealUtils.getHasHole`. Without one the layer is hidden
     * rather than masked.
     * @param center Where the lens's center is, in the element's own pixels.
     * @param radius Half the lens's width and height.
     * @param image The lens's shape, from `RevealUtils.buildHoleImage`.
     * @returns Style properties keyed by their CSS names, hyphenated, with every mask property written plain and
     * `-webkit-` prefixed, since Safari still needs the prefixed spelling.
     */
    export const computeLayerStyle = (
        hasLens: boolean,
        center: Point2d,
        radius: number,
        image: string,
    ): LensLayerStyle => {
        if (!hasLens) return HIDDEN_LAYER;

        const diameter = radius * 2;
        const position = `${center.x - radius}px ${center.y - radius}px`;
        const size = `${diameter}px ${diameter}px`;

        return {
            "mask-image": image,
            "-webkit-mask-image": image,
            "mask-position": position,
            "-webkit-mask-position": position,
            "mask-size": size,
            "-webkit-mask-size": size,
            "mask-repeat": NO_REPEAT,
            "-webkit-mask-repeat": NO_REPEAT,
        };
    };

    /**
     * The style of the magnified copy: drawn `zoom` times larger, scaled about the lens's center.
     *
     * Scaling about that point leaves it where it is, so whatever is under the middle of the lens in the content is
     * under it in the copy too, and everything around it is pushed outwards. The copy is expected to be laid out in
     * a box of the element's own size, with its top-left corner at the element's.
     *
     * @param center Where the lens's center is, in the element's own pixels.
     * @param zoom How many times larger the copy is drawn. `1` draws it at its own size, and less than `1` shrinks it.
     */
    export const computeCopyStyle = (center: Point2d, zoom: number): LensCopyStyle => ({
        "transform": `scale(${zoom})`,
        "transform-origin": `${center.x}px ${center.y}px`,
    });
}
