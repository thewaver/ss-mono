import { type MaybeRefOrGetter, shallowRef, toValue, watch } from "vue";

import { type PointSource, SVGDefsUtils, TrackedPatternUtils } from "@thewaver/ss-components";
import type { Index2d, Point2d, Size2d } from "@thewaver/ss-utils";

import { PointerTrackerVueUtils } from "../../Abstracts/PointerTracker/PointerTrackerVue.utils";
import { SVGFilterDefsFactory } from "../../Generators/SVGDefs/SVGFilters/SVGFilterDefs.factory";
import { watchAfterRender } from "../../Utils/effectUtils";
import { useStore } from "../../Utils/storeUtils";

/**
 * The Vue half of the sample helpers: the parts that return markup or follow a clock. Everything else the samples
 * share is framework-free, in {@link SVGDefsUtils}.
 */
export namespace SVGDefsVueUtils {
    /**
     * The soft-edge filter a sample puts on its paint, when it asks for one.
     *
     * @param id The sample's id, from which the filter's own id is made.
     * @param defs.getSize The painted element's size, which the filter's region is fitted to.
     * @param defs.blurWidth How far the blur spreads; `0` or absent means no filter.
     * @returns A filter def to hand to a paint's `filter`, or `undefined` when no blur was asked for.
     */
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
     * Follows a clock made by {@link SVGDefsUtils.createClock}, counting this component as one of its consumers for
     * as long as it is mounted.
     *
     * The component re-renders on every frame the clock ticks, and only while it ticks — which is while something has
     * called `keepAwake` within the clock's grace period.
     *
     * Must run inside a component's `setup`.
     *
     * @param clock The clock, usually made once when the sample's file loads and shared by every copy of it.
     * @returns A read-only ref of the current frame time.
     */
    export const useFrameMs = (clock: ReturnType<typeof SVGDefsUtils.createClock>) => {
        watchAfterRender([], () => clock.retain());

        return useStore(clock.frameMs);
    };

    /**
     * The random values of a tiling's cells, rolled once per cell and kept for as long as the component is mounted.
     *
     * {@link SVGDefsUtils.getRandomValuesWithSplitControl} rolls afresh on every call, which suits Solid, where a
     * sample builds its pattern once. A Vue sample is drawn again on every render of its host, and a fresh roll would
     * restart every cell's animation each time, so this remembers each cell's roll by its id. The rolls happen in the
     * order the cells are drawn, as in Solid, so the cells that meet across a seam still agree.
     *
     * Must run inside a component's `setup`, so the rolls last as long as the component does.
     *
     * @returns The values for one cell, taking the same arguments as the pattern's cell renderer hands over.
     */
    export const useSplitValues = () => {
        const cache = { split: {} as Record<string, string>, cells: {} as Record<string, string> };

        return (cellId: string, index: Index2d, cellCount: { rows: number; cols: number }, isSplit: boolean) =>
            (cache.cells[cellId] ??= SVGDefsUtils.getRandomValuesWithSplitControl(
                cache.split,
                index,
                cellCount,
                isSplit,
            ));
    };

    /**
     * Where the pointer is over a painted element, in the units a pattern filling it is drawn in.
     *
     * Read inside a render function, so the pattern is drawn afresh as the pointer moves, with each cell's level from
     * {@link TrackedPatternUtils.computeLevel}.
     *
     * Must run inside a component's `setup`.
     *
     * @param element The painted element, or `undefined` before it exists.
     * @param areaSize The element's size.
     * @param source The point to follow in place of the pointer. Left out, or reading `undefined`, the pointer.
     * @returns A getter for {@link TrackedPatternUtils.computePointerPoint} at the current reading, so `undefined`
     * while the pointer is away.
     */
    export const usePatternPointer = (
        element: MaybeRefOrGetter<HTMLElement | undefined>,
        areaSize: MaybeRefOrGetter<Size2d>,
        source: MaybeRefOrGetter<PointSource | undefined> = undefined,
    ) => {
        const { reading, isPointerPresent } = PointerTrackerVueUtils.usePointerReading(element, false, source);

        return () => TrackedPatternUtils.computePointerPoint(reading.value, isPointerPresent.value, toValue(areaSize));
    };

    /**
     * The pixel trail of a pattern whose cells answer to the pointer: each cell lights as the pointer passes, holds for
     * `fadeDelayMs` and fades back to rest on its own over `fadeDurationMs`.
     *
     * A frame clock from {@link SVGDefsUtils.createClock} runs while the trail has something left to fade, woken by
     * every move of the pointer, and the component re-renders on each of its frames. Each cell's level is the higher of
     * its live level and what is left of its brightest recent one, remembered by {@link TrackedPatternUtils.createTrail}
     * under the key the caller gives it. With both at `0` there is no clock and no memory, and a cell's live level is
     * drawn as it is. A change of either starts a clock of the new length.
     *
     * Must run inside a component's `setup`.
     *
     * @param getPointer The pointer's position over the pattern, from {@link usePatternPointer}.
     * @param getOpts The sample's resolved options, from `TrackedPatternUtils.resolveOpts`, read when needed.
     * @returns A function taking a cell's key and its live level and answering the level to draw.
     */
    export const usePatternTrail = (
        getPointer: () => Point2d | undefined,
        getOpts: () => ReturnType<typeof TrackedPatternUtils.resolveOpts>,
    ) => {
        const trail = TrackedPatternUtils.createTrail();
        const frameMs = shallowRef(performance.now());

        let clock: ReturnType<typeof SVGDefsUtils.createClock> | undefined;

        watchAfterRender(
            [() => getOpts().fadeDurationMs, () => getOpts().fadeDelayMs],
            ([fadeDurationMs, fadeDelayMs]) => {
                if (!TrackedPatternUtils.getHasTrail({ fadeDurationMs, fadeDelayMs })) return;

                const next = SVGDefsUtils.createClock(
                    TrackedPatternUtils.getTrailSpanMs({ fadeDurationMs, fadeDelayMs }),
                );
                const release = next.retain();
                const unsubscribe = next.frameMs.subscribe(() => {
                    frameMs.value = next.frameMs.get();
                });

                clock = next;

                return () => {
                    unsubscribe();
                    release();
                    clock = undefined;
                };
            },
        );

        watch(getPointer, (pointer) => {
            if (pointer) clock?.keepAwake();
        });

        return (key: string, liveLevel: number) => {
            const opts = getOpts();

            return TrackedPatternUtils.getHasTrail(opts)
                ? trail.computeLevel(key, liveLevel, frameMs.value, opts)
                : liveLevel;
        };
    };
}
