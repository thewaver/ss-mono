import {
    type CSSAnimationKey,
    CSSConst,
    type CSSTransformKey,
    CSS_FILTER_KEYS,
    MathUtils,
    type Point2d,
} from "@thewaver/ss-utils";

/**
 * The order transform functions are written in.
 *
 * CSS applies transforms in the order given, so a rotate before a translate and one after it give
 * different results. Fixing the order means an animation's output does not depend on which order its
 * keys happened to be evaluated in.
 */
const TRANSFORM_ORDER: readonly CSSTransformKey[] = [
    "perspective",
    "matrix",
    "matrix3d",
    "translate",
    "translate3d",
    "translateX",
    "translateY",
    "translateZ",
    "rotate",
    "rotate3d",
    "rotateX",
    "rotateY",
    "rotateZ",
    "skew",
    "skewX",
    "skewY",
    "scale",
    "scale3d",
    "scaleX",
    "scaleY",
    "scaleZ",
];
/**
 * Writes one CSS function call, with the right unit on each argument.
 *
 * Arguments a value does not supply are written as zero, so a partial value is still a valid
 * function call.
 */
const formatFunction = (key: CSSAnimationKey, value: number | number[]) => {
    const units = CSSConst.ANIMATION_UNITS[key];
    const values = Array.isArray(value) ? value : [value];
    const args = units.map((unit, idx) => `${values[idx] ?? 0}${unit}`);

    return `${key}(${args.join(", ")})`;
};

/**
 * Applies an animation's numbers to a cell, and answers which cells alternate with which.
 *
 * The numbers come from evaluating the animation per cell and per frame; what is here is turning
 * them into CSS and the parity tests that let a wave, a ripple or a chequerboard alternate direction
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
    export const assignAnimationProps = (
        el: HTMLElement,
        evalResult: Partial<Record<CSSAnimationKey, number | number[]>>,
    ) => {
        const transforms: string[] = [];
        const filters: string[] = [];

        for (const key of TRANSFORM_ORDER) {
            const value = evalResult[key];

            if (value !== undefined) {
                transforms.push(formatFunction(key, value));
            }
        }

        for (const key of CSS_FILTER_KEYS) {
            const value = evalResult[key];

            if (value !== undefined) {
                filters.push(formatFunction(key, value));
            }
        }

        el.style.transform = transforms.join(" ");
        el.style.filter = filters.join(" ");
    };

    /**
     * Whether a cell sits on an even row.
     *
     * @param dist The cell's distance from the animation's origin, in cells.
     */
    export const isEvenRow = (dist: Point2d) => MathUtils.isEven(dist.y);

    /**
     * Whether a cell sits on an even column.
     *
     * @param dist The cell's distance from the animation's origin, in cells.
     */
    export const isEvenColumn = (dist: Point2d) => MathUtils.isEven(dist.x);

    /**
     * Whether a cell sits on an even ring around the origin.
     *
     * Rings are square rather than round: every cell the same number of steps out along the longer axis
     * is on the same ring, which is what makes a ripple spread as a growing square.
     *
     * @param dist The cell's distance from the animation's origin, in cells.
     */
    export const isEvenRing = (dist: Point2d) =>
        !((!isEvenColumn(dist) && dist.y <= dist.x) || (!isEvenRow(dist) && dist.x <= dist.y));

    /**
     * Whether a cell sits on a light or a dark square of a chequerboard.
     *
     * @param dist The cell's distance from the animation's origin, in cells.
     */
    export const isEvenCheckered = (dist: Point2d) => MathUtils.isEven(dist.x + dist.y);
}
