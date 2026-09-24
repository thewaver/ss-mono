import { createSignal, onCleanup } from "solid-js";

import { Color, MathUtils, type Point2d, RandomUtils, type Size2d } from "@thewaver/ss-utils";

import type { PointerReading } from "../../Abstracts/PointerTracker/PointerTracker.types";
import { SVGFilterDefsFactory } from "../../Generators/SVGDefs/SVGFilters/SVGFilterDefs.factory";
import type { CycleColorKey, SVGDefsColors } from "./SVGDefs.types";

const NO_CONSUMERS = 0;
const TRANSPARENT_ALPHA = 0;
const FULL_STOP = 100;
const POINTER_FADE_START_RATIO = 1;
const POINTER_FADE_END_RATIO = 2;
const CYCLE_COLOR_KEYS: CycleColorKey[] = ["primary", "secondary", "tertiary"];

export namespace SVGDefsUtils {
    export const DEBUG_SEAMS = false;

    /**
     * The color stops of a gradient that repeats a run of colors a given number of times.
     *
     * A flowing gradient reads as a band per color per repeat, and it needs one stop more than that so the
     * last band closes on the color the first one opened with — which is what lets the whole strip slide
     * without a seam. Callers state the repeats rather than the stops for that reason: the off-by-one is the
     * helper's to remember.
     *
     * @param keys The run of colors to repeat, in order.
     * @param repeats How many times the run appears across the gradient.
     * @returns `keys.length * repeats + 1` color keys, opening and closing on the first.
     */
    export const getCycleStopKeys = (keys: CycleColorKey[], repeats: number) =>
        Array.from({ length: keys.length * repeats + 1 }, (_unused, index) => keys[index % keys.length]);

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

    /**
     * The five color stops of a band that fades out symmetrically either side of its core.
     *
     * Transparent at both ends, the falloff alpha a spread either side of the core, and the core alpha at
     * the middle — the ramp every band sample draws. It takes the four numbers already resolved rather than
     * an options object, so each sample keeps its own defaults and two samples asking for different cores
     * cannot end up sharing one.
     *
     * @param color Any CSS color; the stops are built with `rgb(from …)`, so a named color works.
     * @param defs.coreStop Where the core sits, `0`–`100`.
     * @param defs.coreAlpha How opaque the core is.
     * @param defs.falloffSpread How far either side of the core the falloff stops sit.
     * @param defs.falloffAlpha How opaque the band is at those falloff stops.
     * @returns Five stops in ascending order, the first with no `stop` of its own so it anchors at the start.
     */
    export const getFalloffStops = (
        color: string,
        defs: { coreStop: number; coreAlpha: number; falloffSpread: number; falloffAlpha: number },
    ) => [
        { value: `rgb(from ${color} r g b / 0)` },
        { value: `rgb(from ${color} r g b / ${defs.falloffAlpha})`, stop: defs.coreStop - defs.falloffSpread },
        { value: `rgb(from ${color} r g b / ${defs.coreAlpha})`, stop: defs.coreStop },
        { value: `rgb(from ${color} r g b / ${defs.falloffAlpha})`, stop: defs.coreStop + defs.falloffSpread },
        { value: `rgb(from ${color} r g b / 0)`, stop: FULL_STOP },
    ];

    /**
     * Points a def at a filter that another def in the same set already declares.
     *
     * `Shape` renders every def's `renderDefsElement` and references its `id`, so a set whose entries all
     * want the same filter would otherwise emit that filter once per entry — same id, every copy after the
     * first inert. This returns an entry that carries the id and draws nothing, so one declaration serves
     * the whole set.
     *
     * @param filter The filter a sibling def declares, or `undefined` when there is none to share.
     * @returns A reference to it, or `undefined` so the caller can hand the result straight to `filter`.
     */
    export const getSharedFilter = (filter: { id: string } | undefined) =>
        filter && { id: filter.id, renderDefsElement: () => undefined };

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

    export const projectBoxRatioOntoAngle = (ratio: Point2d, angle: number) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad);
        const y = Math.sin(rad);

        return ((ratio.x - 0.5) * x + (ratio.y - 0.5) * y) / (Math.abs(x) + Math.abs(y));
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

    /**
     * A frame clock shared by every sample that animates off the pointer rather than off a SMIL timeline.
     *
     * It runs only while somebody needs it: each consumer registers with `subscribe`, which undoes itself when
     * that consumer is cleaned up, and each pointer movement calls `keepAwake`. With nobody subscribed, or once
     * the grace period has passed since the last wake, the clock stops asking for frames — so a trail that has
     * finished fading costs nothing, and the next movement starts it again.
     *
     * @param graceMs How long the clock keeps running after the last wake, long enough for whatever was left
     * behind to finish fading.
     * @returns The current frame time as a signal, and the `keepAwake` and `subscribe` calls.
     */
    export const createClock = (graceMs: number) => {
        const [getFrameMs, setFrameMs] = createSignal(performance.now());

        let frameId: ReturnType<typeof requestAnimationFrame> | undefined;
        let lastWakeMs = 0;
        let consumerCount = NO_CONSUMERS;

        const advance = () => {
            const nowMs = performance.now();

            setFrameMs(nowMs);

            if (consumerCount === NO_CONSUMERS || nowMs - lastWakeMs > graceMs) {
                frameId = undefined;

                return;
            }

            frameId = requestAnimationFrame(advance);
        };

        return {
            getFrameMs,
            keepAwake: () => {
                lastWakeMs = performance.now();

                if (frameId !== undefined) return;

                frameId = requestAnimationFrame(advance);
            },
            subscribe: () => {
                consumerCount += 1;

                onCleanup(() => {
                    consumerCount -= 1;
                });
            },
        };
    };
}
