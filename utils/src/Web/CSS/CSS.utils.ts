import { CSSConst } from "./CSS.const.js";
import {
    type CSSAnimationKey,
    type CSSAnimationStyle,
    type CSSAnimationValues,
    type CSSBorderRadius,
    type CSSBorderWidth,
    type CSSCornerShape,
    type CSSMargin,
    type CSSPadding,
    type CSSTransformKey,
    CSS_FILTER_KEYS,
} from "./CSS.types.js";

const INHERITED_CSS_KEYS_SET: ReadonlySet<string> = new Set(CSSConst.INHERITED_CSS_KEYS);
const CSS_KEYS_USED_TO_MEASURE_TEXT_SET: ReadonlySet<string> = new Set(CSSConst.CSS_KEYS_USED_TO_MEASURE_TEXT);
const CSS_KEYS_USED_TO_RENDER_TEXT_SET: ReadonlySet<string> = new Set(CSSConst.CSS_KEYS_USED_TO_RENDER_TEXT);
const CSS_KEYS_EXCLUDED_FOR_DISPLAY_INLINE_SET: ReadonlySet<string> = new Set(
    CSSConst.CSS_KEYS_EXCLUDED_FOR_DISPLAY_INLINE,
);
const CSS_KEYS_EXCLUDED_FOR_CANVAS_TEXT_MEASURING_SET: ReadonlySet<string> = new Set(
    CSSConst.CSS_KEYS_EXCLUDED_FOR_CANVAS_TEXT_MEASURING,
);

/**
 * The order transform functions are written in.
 *
 * CSS applies transforms in the order given, so a rotate before a translate and one after it give
 * different results. Fixing the order means a set of values reads the same whatever order its keys
 * happened to be produced in.
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
const toFunctionCall = (key: CSSAnimationKey, value: number | number[]) => {
    const units = CSSConst.ANIMATION_UNITS[key];
    const values = Array.isArray(value) ? value : [value];
    const args = units.map((unit, idx) => `${values[idx] ?? 0}${unit}`);

    return `${key}(${args.join(", ")})`;
};

/**
 * Tests whether a CSS property passes down to child elements on its own.
 *
 * Inherited properties do not need repeating on a child, so they can be left out
 * when a style is copied onto one.
 *
 * @param key A CSS property name in dashed form, such as `letter-spacing`.
 */

export namespace CSSUtils {
    export const isInheritedCssKey = (key: string): key is (typeof CSSConst.INHERITED_CSS_KEYS)[number] =>
        INHERITED_CSS_KEYS_SET.has(key);

    /**
     * Tests whether a CSS property changes how wide text comes out.
     *
     * These are the only properties that need passing to a text measurement — font,
     * spacing and case.
     *
     * @param key A CSS property name in dashed form, such as `font-size`.
     */

    export const isCssKeyUsedToMeasureText = (
        key: string,
    ): key is (typeof CSSConst.CSS_KEYS_USED_TO_MEASURE_TEXT)[number] => CSS_KEYS_USED_TO_MEASURE_TEXT_SET.has(key);

    /**
     * Tests whether a CSS property changes how text *looks* without changing its size —
     * color, decoration, shadow and so on.
     *
     * @param key A CSS property name in dashed form, such as `text-decoration`.
     */

    export const isCssKeyUsedToRenderText = (
        key: string,
    ): key is (typeof CSSConst.CSS_KEYS_USED_TO_RENDER_TEXT)[number] => CSS_KEYS_USED_TO_RENDER_TEXT_SET.has(key);

    /**
     * Tests whether a CSS property does nothing once an element is displayed inline.
     *
     * Inline elements ignore explicit sizes and vertical spacing, so carrying these
     * over would be misleading.
     *
     * @param key A CSS property name in dashed form, such as `height`.
     */

    export const isCssKeyExcludedForDisplayInline = (
        key: string,
    ): key is (typeof CSSConst.CSS_KEYS_EXCLUDED_FOR_DISPLAY_INLINE)[number] =>
        CSS_KEYS_EXCLUDED_FOR_DISPLAY_INLINE_SET.has(key);

    /**
     * Tests whether a CSS property is one a canvas cannot reproduce when measuring text.
     *
     * @param key A CSS property name in dashed form.
     */

    export const isCssKeyExcludedForCanvasTextMeasuring = (
        key: string,
    ): key is (typeof CSSConst.CSS_KEYS_EXCLUDED_FOR_CANVAS_TEXT_MEASURING)[number] =>
        CSS_KEYS_EXCLUDED_FOR_CANVAS_TEXT_MEASURING_SET.has(key);

    /**
     * Tests whether a `display` value makes an element start on its own line.
     *
     * @param display A CSS `display` value. Anything missing or unrecognized counts as
     * not block-like.
     */

    export const isBlockLike = (display?: string) =>
        display === "block" ||
        display === "flex" ||
        display === "grid" ||
        display === "table" ||
        display === "list-item";

    /**
     * Applies one corner style to all four corners.
     *
     * @param lameExponent The corner style. See
     * {@link ShapeConst.CORNER_SHAPE_LAME_EXPONENTS} for the usual values.
     */

    export const spreadCornerShape = (lameExponent: number): CSSCornerShape => ({
        cornerBottomLeftShape: lameExponent,
        cornerBottomRightShape: lameExponent,
        cornerTopLeftShape: lameExponent,
        cornerTopRightShape: lameExponent,
    });

    /** Applies one radius to all four corners. */

    export const spreadRadius = (radius: number): CSSBorderRadius => ({
        borderBottomLeftRadius: radius,
        borderBottomRightRadius: radius,
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
    });

    /** Applies one border width to all four sides. */

    export const spreadWidth = (width: number): CSSBorderWidth => ({
        borderTopWidth: width,
        borderRightWidth: width,
        borderBottomWidth: width,
        borderLeftWidth: width,
    });

    /** Applies one padding to all four sides. */

    export const spreadPadding = (width: number): CSSPadding => ({
        paddingTop: width,
        paddingRight: width,
        paddingBottom: width,
        paddingLeft: width,
    });

    /** Applies one margin to all four sides. */

    export const spreadMargin = (width: number): CSSMargin => ({
        marginTop: width,
        marginRight: width,
        marginBottom: width,
        marginLeft: width,
    });

    /**
     * Turns a set of plain numbers into a style object with `px` units, renaming the
     * keys along the way.
     *
     * Lets one set of numbers feed several CSS properties — the same four values can
     * become `padding-*` on one element and `inset-*` on another.
     *
     * @param entries The numbers, such as the result of {@link spreadPadding}.
     * @param mapKey Turns each key into the CSS property name you want.
     * @returns A style object whose values all carry `px`.
     */

    export const spreadableToStyle = <T extends CSSBorderRadius | CSSBorderWidth | CSSPadding | CSSMargin>(
        entries: T,
        mapKey: (key: keyof T) => string,
    ) => Object.fromEntries(Object.entries(entries).map(([key, value]) => [mapKey(key as keyof T), `${value}px`]));

    /**
     * Writes a set of transform and filter values as the two CSS properties that carry them.
     *
     * Both properties come back in full every time, so a caller assigning the result wholesale drops
     * whatever the previous set wrote — a value that stops being produced stops applying, rather than
     * lingering because nothing overwrote it. Transform functions are ordered rather than taken as
     * given, since CSS applies them in sequence and the same set in another order is another
     * transform.
     *
     * @param values The functions and their arguments, keyed by CSS function name.
     * @returns `transform` and `filter`, each an empty string when nothing asked for it.
     */

    export const toAnimationStyle = (values: CSSAnimationValues): CSSAnimationStyle => {
        const transforms: string[] = [];
        const filters: string[] = [];

        for (const key of TRANSFORM_ORDER) {
            const value = values[key];

            if (value !== undefined) transforms.push(toFunctionCall(key, value));
        }

        for (const key of CSS_FILTER_KEYS) {
            const value = values[key];

            if (value !== undefined) filters.push(toFunctionCall(key, value));
        }

        return { transform: transforms.join(" "), filter: filters.join(" ") };
    };
}
