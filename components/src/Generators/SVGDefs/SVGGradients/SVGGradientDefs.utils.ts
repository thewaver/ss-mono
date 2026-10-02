import { type Rect, SVGUtils } from "@thewaver/ss-utils";

import { PaintAreaUtils } from "../PaintArea/PaintArea.utils";
import type {
    SVGGradientColor,
    SVGGradientSpreadKind,
    SVGGradientStop,
    SVGPaintAreaAttributes,
    SVGRadialGradientFields,
    SVGRadialGradientGeometry,
} from "./SVGGradientDefs.types";

/** The first color in a run, which opens the gradient at nought and needs no closing stop before it. */
const FIRST_COLOR_INDEX = 0;

/** A radial gradient radiates from the center unless told otherwise. */
const DEFAULT_RADIAL_ORIGIN = { x: 0.5, y: 0.5 };

const FULL_STOP = 100;

/** Fills in the positions of colors that were not given one. Published as {@link SVGGradientDefsUtils.resolveStops}. */
const computeResolvedStops = (colors: SVGGradientColor[]) =>
    colors.map((c, i) => {
        const prevIdx = colors.findLastIndex((x, j) => j <= i && x.stop != null);
        const nextIdx = colors.findIndex((x, j) => j >= i && x.stop != null);

        const prevStop = prevIdx >= 0 ? colors[prevIdx].stop! : 0;
        const nextStop = nextIdx >= 0 ? colors[nextIdx].stop! : FULL_STOP;

        const prev = prevIdx >= 0 ? prevIdx : 0;
        const next = nextIdx >= 0 ? nextIdx : colors.length - 1;

        return c.stop ?? (prev === next ? prevStop : prevStop + ((nextStop - prevStop) * (i - prev)) / (next - prev));
    });

/**
 * The arithmetic behind `linearGradient` and `radialGradient` definitions: where each stop sits, and where a
 * radial gradient is centered and how far it reaches.
 *
 * Two things are handled that raw SVG does not. A gradient can be described by an angle rather than
 * by two endpoints, which is how CSS describes one and how a caller expects to — that half is
 * `SVGUtils.getLinearCoords` in `ss-utils`. And the colors may be given without positions, in which
 * case they are spread evenly. The elements themselves are each framework's markup.
 */
export namespace SVGGradientDefsUtils {
    /**
     * Fills in the positions of colors that were not given one.
     *
     * Unpinned colors are spread evenly between the pinned ones either side of them, with the start
     * and end of the gradient standing in where there is no pinned color to either side. This is what
     * lets a caller write four colors and get them at nought, a third, two thirds and one.
     *
     * @param colors The colors, each optionally pinned to a percentage along the gradient.
     * @returns One percentage per color, in the same order.
     */
    export const resolveStops = computeResolvedStops;

    /**
     * The `stop` elements a gradient's colors become.
     *
     * `"smooth"` gives one stop per color, so the colors blend into each other. `"banded"` gives two per
     * boundary — the color before closing and the color after opening at the same offset — so each color
     * holds to its band and changes abruptly at the edge rather than blending.
     *
     * @param id The gradient's id, which each stop's own id is built from.
     * @param colors The colors, each optionally pinned to a percentage along the gradient.
     * @param spreadKind `"banded"` for hard edges; anything else blends.
     * @returns The stops in document order, each with its id, its offset as a percentage and its color.
     */
    export const computeStops = (
        id: string,
        colors: SVGGradientColor[],
        spreadKind: SVGGradientSpreadKind | undefined,
    ): SVGGradientStop[] => {
        const stops = computeResolvedStops(colors);

        if (spreadKind !== "banded") {
            return colors.map((color, i) => ({ id: `${id}-stop-${i}`, offset: `${stops[i]}%`, color: color.value }));
        }

        return colors.flatMap((color, i) =>
            i === FIRST_COLOR_INDEX
                ? [{ id: `${id}-stop-${i}-start`, offset: "0%", color: color.value }]
                : [
                      { id: `${id}-stop-${i - 1}-end`, offset: `${stops[i]}%`, color: colors[i - 1].value },
                      { id: `${id}-stop-${i}-start`, offset: `${stops[i]}%`, color: color.value },
                  ],
        );
    };

    /**
     * Lays a gradient across a paint area rather than across the element it happens to paint.
     *
     * A gradient's positions are fractions of a box, and by default that box is whatever element the gradient
     * paints — so several elements sharing one gradient each show all of it. Given an area, the fractions are
     * stretched over that area instead, in the painted elements' own coordinates, and each element shows only the
     * part of the gradient that falls where it sits. The fractions themselves, and any animation that moves them,
     * are untouched.
     *
     * @param area The box the gradient is laid across, in the coordinates of the elements it paints. Without one,
     * or with one that has no width or no height yet, the gradient follows each element's own box as before.
     * @param gradientTransform The gradient's own transform, which is kept and applied inside the area.
     * @returns The `gradientUnits` and `gradientTransform` attributes; both are `undefined` when there is no area
     * and no transform, so the attributes can be left off.
     */
    export const computePaintAreaAttributes = (
        area: Rect | undefined,
        gradientTransform: string | undefined,
    ): SVGPaintAreaAttributes => {
        const areaTransform = PaintAreaUtils.computeTransform(area);

        if (!areaTransform) return { gradientUnits: undefined, gradientTransform };

        return {
            gradientUnits: "userSpaceOnUse",
            gradientTransform: gradientTransform ? `${areaTransform} ${gradientTransform}` : areaTransform,
        };
    };

    /**
     * Where a radial gradient is centered, how far it reaches and how it is squashed and turned.
     *
     * @param defs The `origin` to radiate from, the middle when missing; a `scale` for the radius, where `1`
     * reaches the edge of the box; `aspect` and `angle` for making it an ellipse; and `elementSize` to hold it
     * round on an oblong element rather than letting it follow the box.
     * @returns The `cx`, `cy` and `r` attributes, and the `gradientTransform`, which is `undefined` when the
     * gradient is an untransformed circle and the attribute should be left off.
     */
    export const computeRadialGeometry = (defs: Omit<SVGRadialGradientFields, "colors">): SVGRadialGradientGeometry => {
        const origin = defs.origin ?? DEFAULT_RADIAL_ORIGIN;

        return {
            cx: origin.x,
            cy: origin.y,
            r: 0.5 * (defs.scale ?? 1),
            gradientTransform: SVGUtils.getRadialTransform({
                origin,
                aspect: defs.aspect,
                angle: defs.angle,
                elementSize: defs.elementSize,
            }),
        };
    };
}
