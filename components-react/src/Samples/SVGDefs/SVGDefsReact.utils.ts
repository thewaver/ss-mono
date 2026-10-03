import { type RefObject, useEffect, useRef, useState } from "react";

import { SVGDefsUtils, TrackedPatternUtils } from "@thewaver/ss-components";
import type { Index2d, Size2d } from "@thewaver/ss-utils";

import { PointerTrackerReactUtils } from "../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import { SVGFilterDefsFactory } from "../../Generators/SVGDefs/SVGFilters/SVGFilterDefs.factory";
import { useStore } from "../../Utils/storeUtils";

/**
 * The React half of the sample helpers: the parts that return markup or follow a clock. Everything else the samples
 * share is framework-free, in {@link SVGDefsUtils}.
 */
export namespace SVGDefsReactUtils {
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
     * @param clock The clock, usually made once when the sample's file loads and shared by every copy of it.
     * @returns The current frame time.
     */
    export const useFrameMs = (clock: ReturnType<typeof SVGDefsUtils.createClock>) => {
        useEffect(() => clock.retain(), [clock]);

        return useStore(clock.frameMs);
    };

    /**
     * Holds an element handed over as a value in a ref, so a hook that follows a `RefObject` can follow it.
     *
     * A sample is handed the painted element as a value, since `computeSVGDefs` runs during the component's render;
     * the hooks that watch the pointer take a ref. The ref is brought up to date on every render, and those hooks
     * read it after each commit.
     *
     * @param element The element, or `undefined` before it exists.
     * @returns A ref holding it.
     */
    export const useElementRef = (element: HTMLElement | undefined): RefObject<HTMLElement | null> => {
        const ref = useRef<HTMLElement | null>(null);

        ref.current = element ?? null;

        return ref;
    };

    /**
     * Where the pointer is over a painted element, in the units a pattern filling it is drawn in.
     *
     * Re-renders the component as the pointer moves, which is what a pattern whose cells answer to the pointer
     * needs: the cells are drawn afresh on each move with their levels from {@link TrackedPatternUtils.computeLevel}.
     *
     * @param element The painted element, or `undefined` before it exists.
     * @param areaSize The element's size.
     * @returns {@link TrackedPatternUtils.computePointerPoint} for the current reading, so `undefined` while the
     * pointer is away.
     */
    export const usePatternPointer = (element: HTMLElement | undefined, areaSize: Size2d) => {
        const { reading, isPointerPresent } = PointerTrackerReactUtils.usePointerReading(useElementRef(element));

        return TrackedPatternUtils.computePointerPoint(reading, isPointerPresent, areaSize);
    };

    /**
     * The random values of a tiling's cells, rolled once per cell and kept for as long as the component is mounted.
     *
     * {@link SVGDefsUtils.getRandomValuesWithSplitControl} rolls afresh on every call, which suits Solid, where a
     * sample builds its pattern once. A React sample is drawn again on every render of its host, and a fresh roll
     * would restart every cell's animation each time, so this remembers each cell's roll by its id. The rolls happen
     * in the order the cells are drawn, as in Solid, so the cells that meet across a seam still agree.
     *
     * @returns The values for one cell, taking the same arguments as the pattern's cell renderer hands over.
     */
    export const useSplitValues = () => {
        const [cache] = useState(() => ({ split: {} as Record<string, string>, cells: {} as Record<string, string> }));

        return (cellId: string, index: Index2d, cellCount: { rows: number; cols: number }, isSplit: boolean) =>
            (cache.cells[cellId] ??= SVGDefsUtils.getRandomValuesWithSplitControl(
                cache.split,
                index,
                cellCount,
                isSplit,
            ));
    };
}
