import { ObjectUtils, type Point2d, type ShapeGeometry, ShapeUtils } from "@thewaver/ss-utils";

import type { SVGDefsOf } from "../../Generators/SVGDefs/SVGDefs.types";
import type { ShapeStrokeGeom } from "./Shape.types";

const DEFAULT_STROKE_GEOM: ShapeStrokeGeom = { thicknesses: [0] };
const NO_EDGE_THICKNESSES = [0];
const MIN_CONTOUR_POINTS = 3;
const BLEND_MODE = "screen" as const;

/**
 * The arithmetic behind `Shape`'s two SVG layers: which contour each stroke paints along, the float shape its
 * content wraps around, and the attributes a defs record paints a path with. The layers themselves are each
 * framework's markup.
 */
export namespace ShapeLayerUtils {
    /**
     * The contour a shape is drawn from and the styling that goes with it, from what `computePoints` returned and the
     * props.
     *
     * `computePoints` may return bare corners, which take the props' styling as it is, or corners with styling of
     * their own — a contour that grows corners as its size changes, an arrow being the case in point, is the only
     * thing that knows which entry belongs to which corner. A list it returns replaces the matching prop; one it
     * leaves out falls back to the prop. Returned stroke thicknesses replace each stroke's thicknesses in turn and
     * keep its offset, and a returned list with no stroke to go with it still gets one.
     *
     * @param contour What `computePoints` returned.
     * @param joinRadii The `joinRadii` prop.
     * @param lameExponents The `lameExponents` prop.
     * @param strokeGeom The `strokeGeom` prop.
     * @returns The corners and the three lists to draw them with, in the form {@link computeLayerPaths} takes.
     */
    export const computeGeometry = (
        contour: Point2d[] | ShapeGeometry,
        joinRadii: number[] | undefined,
        lameExponents: number[] | undefined,
        strokeGeom: ShapeStrokeGeom[] | undefined,
    ) => {
        if (Array.isArray(contour)) return { points: contour, joinRadii, lameExponents, strokeGeom };

        const thicknesses = contour.strokeThicknesses;

        return {
            points: contour.points,
            joinRadii: contour.joinRadii ?? joinRadii,
            lameExponents: contour.lameExponents ?? lameExponents,
            strokeGeom: thicknesses
                ? Array.from({ length: Math.max(thicknesses.length, strokeGeom?.length ?? 0) }, (_unused, index) => ({
                      ...strokeGeom?.[index],
                      thicknesses: thicknesses[index] ?? strokeGeom?.[index]?.thicknesses ?? NO_EDGE_THICKNESSES,
                  }))
                : strokeGeom,
        };
    };

    /**
     * The contours a shape's layers are drawn along, one per stroke.
     *
     * With no strokes there is one contour, the shape's own, which the fill and the content's clip path follow.
     * With strokes, each stroke is paired with a geometry — the strokes and the geometries stretched to the
     * longer of the two, and a single zero-width geometry standing in when none is given — and two strokes whose
     * geometries agree share one contour rather than building it twice. The first contour is always the one the
     * fill, the clip path and the float shape use.
     *
     * @param points The shape's corners, in the element's own pixels.
     * @param strokeDefs The strokes, only counted.
     * @param strokeGeom How thick each stroke is along each edge, and how far it is offset.
     * @param joinRadii How far each corner is rounded.
     * @param lameExponents How square each rounded corner is.
     * @returns One set of paths per stroke, or one for the shape itself when there are no strokes.
     */
    export const computeLayerPaths = (
        points: Point2d[],
        strokeDefs: readonly unknown[] | undefined,
        strokeGeom: ShapeStrokeGeom[] | undefined,
        joinRadii: number[] | undefined,
        lameExponents: number[] | undefined,
    ) => {
        if (!strokeDefs?.length) {
            return [ShapeUtils.getPaths(points, NO_EDGE_THICKNESSES, joinRadii, lameExponents)];
        }

        const cache: Record<string, ReturnType<typeof ShapeUtils.getPaths>> = {};
        const pairs = ObjectUtils.zipArray(
            "stretch",
            [...strokeDefs],
            strokeGeom?.length ? strokeGeom : [DEFAULT_STROKE_GEOM],
        );

        return pairs.map(([, geom]) => {
            const { thicknesses, offset } = geom as ShapeStrokeGeom;
            const key = `${thicknesses.map((t) => Math.floor(t)).join("_")}_${offset ?? ""}`;

            cache[key] ??= ShapeUtils.getPaths(points, thicknesses, joinRadii, lameExponents, offset);

            return cache[key];
        });
    };

    /**
     * The `shape-outside` that lets text flow around the shape rather than around its box.
     *
     * @param points The contour to wrap around, in the element's own pixels.
     * @returns A `polygon()` against the border box, or `undefined` when there are too few points to enclose
     * anything.
     */
    export const computeShapeOutside = (points: Point2d[]) => {
        if (points.length < MIN_CONTOUR_POINTS) return undefined;

        return `polygon(${points.map((point) => `${point.x}px ${point.y}px`).join(", ")}) border-box`;
    };

    /**
     * The attributes one defs record paints a path with.
     *
     * @param def The record: a flat color or a gradient or pattern to fill with, an opacity, and a filter and a
     * clip path to point at.
     * @returns The `fill`, as a color or a `url(#…)` reference, the fill opacity, the `filter` and `clip-path`
     * references or `undefined` where the record has none, and the `mix-blend-mode` to apply, if any.
     */
    export const computePaint = <TElement>(def: SVGDefsOf<TElement>) => ({
        fill: def.gradientOrPattern ? `url(#${def.gradientOrPattern.id})` : def.color,
        fillOpacity: def.opacity,
        filter: def.filter ? `url(#${def.filter.id})` : undefined,
        clipPath: def.clipPath ? `url(#${def.clipPath.id})` : undefined,
        mixBlendMode: def.blend ? BLEND_MODE : undefined,
    });
}
