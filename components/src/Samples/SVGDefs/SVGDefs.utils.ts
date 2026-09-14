import { Color, MathUtils, RandomUtils, type Size2d } from "@thewaver/ss-utils";

import type { PointerReading } from "../../Abstracts/PointerTracker/PointerTracker.types";
import { SVGFilterDefsFactory } from "../../Abstracts/SVG/Defs/Filter/SVGFilterDefs.factory";
import type { SVGDefsColors } from "./SVGDefs.types";

const TRANSPARENT_ALPHA = 0;
const POINTER_FADE_START_RATIO = 1;
const POINTER_FADE_END_RATIO = 2;
const CYCLE_COLOR_KEYS = ["primary", "secondary", "tertiary"] as const;

export namespace SVGDefsUtils {
    export const DEBUG_SEAMS = false;

    export const DEFAULT_GRADIENT_STEPS = 12;

    /**
     * The colour stops of a gradient that repeats a run of colours a given number of times.
     *
     * A flowing gradient reads as a band per colour per repeat, and it needs one stop more than that so the
     * last band closes on the colour the first one opened with — which is what lets the whole strip slide
     * without a seam. Callers state the repeats rather than the stops for that reason: the off-by-one is the
     * helper's to remember.
     *
     * @param keys The run of colours to repeat, in order.
     * @param repeats How many times the run appears across the gradient.
     * @returns `keys.length * repeats + 1` colour keys, opening and closing on the first.
     */
    export const getCycleStopKeys = (keys: CycleColorKey[], repeats: number) =>
        Array.from({ length: keys.length * repeats + 1 }, (_unused, index) => keys[index % keys.length]);

    export type CycleColorKey = (typeof CYCLE_COLOR_KEYS)[number];

    export const getCycleWalk = (colors: SVGDefsColors, key: CycleColorKey) => {
        const start = CYCLE_COLOR_KEYS.indexOf(key);

        return [...CYCLE_COLOR_KEYS.slice(start), ...CYCLE_COLOR_KEYS.slice(0, start), key].map(
            (walkKey) => colors[walkKey],
        );
    };

    export const getBaseBlur = (
        id: string,
        defs: {
            getSize: () => Size2d;
            blurWidth?: number;
        },
    ) =>
        defs.blurWidth
            ? {
                  id: `border-blur-filter-${id}`,
                  renderDefsElement: () =>
                      new SVGFilterDefsFactory(`border-blur-filter-${id}`)
                          .addGaussianBlurFilter({ stdDeviation: defs.blurWidth! })
                          .computeFilterPrimitives({ method: "isolate", elementSize: defs.getSize() }),
              }
            : undefined;

    export const getBaseBackgroundColor = (defs: { colors: SVGDefsColors }) =>
        `hsl(from ${defs.colors.background} h s calc(l * 1.5) / 25%)`;

    export const getBaseBorderColor = (defs: { colors: SVGDefsColors }) =>
        `hsl(from ${defs.colors.background} h s calc(l * 1.5) / 50%)`;

    export const getTransparentColor = (color: string) =>
        Color.Hex.isHex(color)
            ? Color.RGBA.toCss({ ...Color.Hex.toRgb(color), a: TRANSPARENT_ALPHA })
            : `rgb(from ${color} r g b / 0)`;

    export const getPointerFade = (reading: PointerReading, isPointerPresent: boolean) =>
        isPointerPresent
            ? MathUtils.clamp01(
                  MathUtils.normalize(reading.edgeRatio, POINTER_FADE_END_RATIO, POINTER_FADE_START_RATIO),
              )
            : 0;

    export const offsetDiagonally = (v: number, angle: number) => {
        const rad = (angle * Math.PI) / 180;

        return { x: v * Math.cos(rad), y: v * Math.sin(rad) };
    };

    export const getRandomValuesWithSplitControl = (
        mutableSplitValuesCache: Record<string, string>,
        index: { row: number; col: number },
        cellCount: { rows: number; cols: number },
        isSplit: boolean,
    ) => {
        let values = RandomUtils.get01ValueString(8);

        if (isSplit) {
            if (index.col === cellCount.cols - 1) {
                values = mutableSplitValuesCache[`row${index.row}`] ?? values;
            }
            if (index.row === cellCount.rows - 1) {
                values = mutableSplitValuesCache[`col${index.col}`] ?? values;
            }
            if (index.col === 0) {
                mutableSplitValuesCache[`row${index.row}`] = values;
            }
            if (index.row === 0) {
                mutableSplitValuesCache[`col${index.col}`] = values;
            }
        }

        return values;
    };
}
