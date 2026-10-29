import { CSSConst } from "./CSS.const.js";
import {
    type CSSAnimationKey,
    type CSSAnimationStyle,
    type CSSAnimationValues,
    type CSSBorderRadius,
    type CSSBorderWidth,
    type CSSCornerShape,
    type CSSFilterKey,
    type CSSLogicalPadding,
    type CSSMargin,
    type CSSPhysicalPadding,
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

    let call = `${key}(`;

    for (let idx = 0; idx < units.length; idx++) {
        const arg = Array.isArray(value) ? value[idx] : idx === 0 ? value : undefined;

        call += `${idx === 0 ? "" : ", "}${arg ?? 0}${units[idx]}`;
    }

    return `${call})`;
};

/** Adds one function call to a list of them, space-separated as `transform` and `filter` take them. */
const appendCall = (list: string, call: string) => (list ? `${list} ${call}` : call);

/** How many of an opacity's percentage points make the `opacity` property's whole. */
const PERCENT = 100;

/** The order filter functions are written in: every one but `opacity`, which is a property of its own. */
const FILTER_ORDER: readonly CSSFilterKey[] = CSS_FILTER_KEYS.filter((key) => key !== "opacity");

/** Whether a filter function's value is the one at which it changes nothing. */
const isNeutralFilter = (key: CSSFilterKey, value: number | number[]) => {
    const neutral = CSSConst.NEUTRAL_FILTER_VALUES[key];

    return neutral !== undefined && (Array.isArray(value) ? value[0] : value) === neutral;
};

/** An opacity in percent as the `opacity` property's value, or empty when it is absent or changes nothing. */
const toOpacity = (value: number | number[] | undefined) => {
    const percent = Array.isArray(value) ? value[0] : value;

    return percent === undefined || percent === CSSConst.NEUTRAL_FILTER_VALUES.opacity ? "" : `${percent / PERCENT}`;
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

    /** Applies one padding to all four sides of the screen. */

    export const spreadPhysicalPadding = (width: number): CSSPhysicalPadding => ({
        paddingTop: width,
        paddingRight: width,
        paddingBottom: width,
        paddingLeft: width,
    });

    /** Applies one padding to all four sides of the text. See {@link CSSLogicalPadding}. */

    export const spreadLogicalPadding = (width: number): CSSLogicalPadding => ({
        paddingBlockStart: width,
        paddingInlineEnd: width,
        paddingBlockEnd: width,
        paddingInlineStart: width,
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
     * @param entries The numbers, such as the result of {@link spreadPhysicalPadding}.
     * @param mapKey Turns each key into the CSS property name you want.
     * @returns A style object whose values all carry `px`.
     */

    export const spreadableToStyle = <
        T extends CSSBorderRadius | CSSBorderWidth | CSSPhysicalPadding | CSSLogicalPadding | CSSMargin,
    >(
        entries: T,
        mapKey: (key: keyof T) => string,
    ) => Object.fromEntries(Object.entries(entries).map(([key, value]) => [mapKey(key as keyof T), `${value}px`]));

    /**
     * Writes a set of transform and filter values as the three CSS properties that carry them.
     *
     * All three come back in full every time, so a caller assigning the result wholesale drops
     * whatever the previous set wrote — a value that stops being produced stops applying, rather than
     * lingering because nothing overwrote it. Transform functions are ordered rather than taken as
     * given, since CSS applies them in sequence and the same set in another order is another
     * transform.
     *
     * `opacity` is written as the `opacity` property, from 0 to 1, rather than as a filter function,
     * and a filter function at the value where it changes nothing
     * ({@link CSSConst.NEUTRAL_FILTER_VALUES}) is left out, an `opacity` of 100 included. A caller
     * has to write all three, or a fade is lost.
     *
     * @param values The functions and their arguments, keyed by CSS function name.
     * @returns `transform`, `filter` and `opacity`, each an empty string when there is nothing to write.
     */

    export const toAnimationStyle = (values: CSSAnimationValues): CSSAnimationStyle => {
        let transform = "";
        let filter = "";

        for (const key of TRANSFORM_ORDER) {
            const value = values[key];

            if (value !== undefined) transform = appendCall(transform, toFunctionCall(key, value));
        }

        for (const key of FILTER_ORDER) {
            const value = values[key];

            if (value !== undefined && !isNeutralFilter(key, value)) {
                filter = appendCall(filter, toFunctionCall(key, value));
            }
        }

        return { transform, filter, opacity: toOpacity(values.opacity) };
    };
}
