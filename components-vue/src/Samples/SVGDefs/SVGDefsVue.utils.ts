import { SVGDefsUtils } from "@thewaver/ss-components";
import type { Index2d, Size2d } from "@thewaver/ss-utils";

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
}
