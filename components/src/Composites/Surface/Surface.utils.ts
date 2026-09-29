import { type CSSBorderRadius, type CSSBorderWidth, type CSSCornerShape, ShapeConst } from "@thewaver/ss-utils";

import type { SVGDefsOf } from "../../Generators/SVGDefs/SVGDefs.types";

const NO_BORDER_WIDTHS = [0];
const FULL_OPACITY = 1;
const PERCENT = 100;

/**
 * Whether one defs record needs the SVG path: anything beyond a flat color and an opacity. Published as
 * {@link SurfaceUtils.getIsComplexDef}.
 */
const computeIsComplexDef = <TElement>(def: SVGDefsOf<TElement>) =>
    !!def.blend || !!def.clipPath || !!def.filter || !!def.gradientOrPattern;

/**
 * The decisions behind `Surface` and `GlassSurface`: which of the two render paths a surface takes, and how the
 * named CSS sides and corners become the clockwise lists the shape builder reads. The markup of either path is each
 * framework's.
 */
export namespace SurfaceUtils {
    /**
     * Whether one defs record needs the SVG path.
     *
     * @param def The record.
     * @returns `true` for anything a `div` cannot paint — a blend, a clip path, a filter, a gradient or a pattern.
     */
    export const getIsComplexDef = computeIsComplexDef;

    /**
     * Whether a surface is drawn as an SVG shape rather than as a plain `div`.
     *
     * A `div` paints a flat color, a border and round corners natively, which is cheaper and sharper, so the SVG
     * path is taken only when something asks for more: a record {@link getIsComplexDef} flags, or a corner that is
     * not a plain round.
     *
     * @param fillDefs The fill's records, if any.
     * @param strokeDefs The stroke's records, if any.
     * @param lameExponents The corner shapes, if any.
     */
    export const getIsComplex = <TElement>(
        fillDefs: SVGDefsOf<TElement>[] | undefined,
        strokeDefs: SVGDefsOf<TElement>[] | undefined,
        lameExponents: CSSCornerShape | undefined,
    ) =>
        !!fillDefs?.some(computeIsComplexDef) ||
        !!strokeDefs?.some(computeIsComplexDef) ||
        (!!lameExponents &&
            Object.values(lameExponents).some((v) => v !== ShapeConst.CORNER_SHAPE_LAME_EXPONENTS.round));

    /**
     * The first record carrying a flat color, which is what the `div` path paints with.
     *
     * @param defs The records, if any.
     */
    export const findColorDef = <TElement>(defs: SVGDefsOf<TElement>[] | undefined) => defs?.find((v) => !!v.color);

    /**
     * Whether the `div` path draws a border: only when there is a color to draw it in and some side has width.
     *
     * @param strokeColorDef The stroke's color record, from {@link findColorDef}.
     * @param borderWidths The widths of the four sides.
     */
    export const getHasBorder = <TElement>(
        strokeColorDef: SVGDefsOf<TElement> | undefined,
        borderWidths: CSSBorderWidth,
    ) => !!strokeColorDef && Object.values(borderWidths).some((v) => v > 0);

    /**
     * A record's opacity as the percentage the `div` path's color variables take.
     *
     * @param def The record. Missing, or without an opacity, is fully opaque.
     */
    export const computeOpacityPercent = <TElement>(def: SVGDefsOf<TElement> | undefined) =>
        `${(def?.opacity ?? FULL_OPACITY) * PERCENT}%`;

    /**
     * The corner radii clockwise from the top left, as the shape builder reads them.
     *
     * @param namedRadii The four radii by CSS name.
     */
    export const computeJoinRadii = (namedRadii: CSSBorderRadius) => [
        namedRadii.borderTopLeftRadius,
        namedRadii.borderTopRightRadius,
        namedRadii.borderBottomRightRadius,
        namedRadii.borderBottomLeftRadius,
    ];

    /**
     * The side widths clockwise from the top, as the shape builder reads them.
     *
     * @param namedWidths The four widths by CSS name. Missing gives no width at all.
     */
    export const computeBorderWidths = (namedWidths: CSSBorderWidth | undefined) =>
        namedWidths
            ? [
                  namedWidths.borderTopWidth,
                  namedWidths.borderRightWidth,
                  namedWidths.borderBottomWidth,
                  namedWidths.borderLeftWidth,
              ]
            : NO_BORDER_WIDTHS;

    /**
     * The corner shapes clockwise from the top left, as the shape builder reads them.
     *
     * @param namedShapes The four shapes by CSS name. Missing gives one plain round for every corner.
     */
    export const computeLameExponents = (namedShapes: CSSCornerShape | undefined) =>
        namedShapes
            ? [
                  namedShapes.cornerTopLeftShape,
                  namedShapes.cornerTopRightShape,
                  namedShapes.cornerBottomRightShape,
                  namedShapes.cornerBottomLeftShape,
              ]
            : [ShapeConst.CORNER_SHAPE_LAME_EXPONENTS.round];
}
