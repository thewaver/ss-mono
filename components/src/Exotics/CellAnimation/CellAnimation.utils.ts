import { type CSSAnimationValues, CSSUtils, type Index2d, MathUtils } from "@thewaver/ss-utils";

/**
 * Applies an animation's numbers to a cell, and answers which cells alternate with which.
 *
 * The numbers come from evaluating the animation per cell and per frame; what is here is turning
 * them into CSS and the parity tests that let a wave, a ripple or a checkerboard alternate direction
 * across the grid.
 */
export namespace CellAnimationUtils {
    /**
     * Writes an animation's values onto a cell as `transform` and `filter`.
     *
     * Set on the element's style directly rather than through a signal, because this runs for every cell
     * on every frame and the reactive round trip is not affordable at that rate.
     *
     * @param el The cell's element.
     * @param evalResult The animation's values for this cell and frame, by CSS function name. Functions
     * not mentioned are left out, and both properties are rewritten in full each time, so a value that
     * stops being produced stops applying.
     */
    export const assignAnimationProps = (el: HTMLElement, evalResult: CSSAnimationValues) => {
        const style = CSSUtils.toAnimationStyle(evalResult);

        el.style.transform = style.transform;
        el.style.filter = style.filter;
    };

    /**
     * Whether a cell sits on an even row.
     *
     * @param dist The cell's distance from the animation's origin, in cells.
     */
    export const isEvenRow = (dist: Index2d) => MathUtils.isEven(dist.row);

    /**
     * Whether a cell sits on an even column.
     *
     * @param dist The cell's distance from the animation's origin, in cells.
     */
    export const isEvenColumn = (dist: Index2d) => MathUtils.isEven(dist.col);

    /**
     * Whether a cell sits on an even ring around the origin.
     *
     * Rings are square rather than round: every cell the same number of steps out along the longer axis
     * is on the same ring, which is what makes a ripple spread as a growing square.
     *
     * @param dist The cell's distance from the animation's origin, in cells.
     */
    export const isEvenRing = (dist: Index2d) =>
        !((!isEvenColumn(dist) && dist.row <= dist.col) || (!isEvenRow(dist) && dist.col <= dist.row));

    /**
     * Whether a cell sits on a light or a dark square of a checkerboard.
     *
     * @param dist The cell's distance from the animation's origin, in cells.
     */
    export const isEvenCheckered = (dist: Index2d) => MathUtils.isEven(dist.col + dist.row);
}
