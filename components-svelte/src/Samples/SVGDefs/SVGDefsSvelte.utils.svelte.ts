import { SVGDefsUtils, TrackedPatternUtils } from "@thewaver/ss-components";
import type { Index2d, Point2d, Size2d } from "@thewaver/ss-utils";

import { SVGFilterDefsFactory } from "../../Generators/SVGDefs/SVGFilters/SVGFilterDefs.factory.js";
import { readStore } from "../../Utils/storeUtils.js";

/**
 * The Svelte half of the sample helpers: the parts that return markup or follow a clock. Everything else the samples
 * share is framework-free, in {@link SVGDefsUtils}.
 */
export namespace SVGDefsSvelteUtils {
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
     * {@link SVGDefsUtils.createClock} read as a getter.
     *
     * The clock is usually made once, when the sample's file loads, and shared by every copy of the sample. Each
     * component that draws from it calls `subscribe` while it is being set up, which counts it as a consumer for as
     * long as it is mounted; the clock ticks only while it has a consumer and something has called `keepAwake` within
     * its grace period.
     *
     * @param graceMs How long the clock keeps running after the last wake.
     * @returns `getFrameMs`, the current frame time, which re-runs whatever reads it on every tick; `keepAwake`; and
     * `subscribe`, which must be called while a component is being set up.
     */
    export const createClock = (graceMs: number) => {
        const clock = SVGDefsUtils.createClock(graceMs);

        return {
            getFrameMs: readStore(clock.frameMs),
            keepAwake: clock.keepAwake,
            subscribe: () => {
                $effect(() => clock.retain());
            },
        };
    };

    /**
     * The random values of a tiling's cells, rolled once per cell and kept for as long as the component that made
     * them is mounted.
     *
     * {@link SVGDefsUtils.getRandomValuesWithSplitControl} rolls afresh on every call. A pattern is drawn again
     * whenever its colors, its cell size or its host change, and a fresh roll would restart every cell's animation
     * each time, so this remembers each cell's roll by its id. The rolls happen in the order the cells are drawn, so
     * the cells that meet across a seam still agree. A change of colors or cell size therefore keeps the rolls.
     *
     * @returns The values for one cell, taking the same arguments as the pattern's cell renderer hands over.
     */
    export const createSplitValues = () => {
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
     * The fading trail a tracked pattern's cells leave behind the pointer, for a sample whose options ask for one.
     *
     * {@link TrackedPatternUtils.createTrail} tied to a clock of its own. The clock exists only while the resolved
     * options give a trail, is made again when its length changes, and is counted as consumed for as long as the
     * component is mounted; every move of a point that is present wakes it, so the trail fades on frames rather than
     * on pointer events and stops ticking once the last glow has gone.
     *
     * Must run while a component is being set up.
     *
     * @param getOpts The pattern's resolved options, from {@link TrackedPatternUtils.resolveOpts}.
     * @param getPointer The pointer's position in the pattern, or `undefined` while it is absent.
     * @returns The level to draw a cell at, from its index and its live level. It reads the clock while a trail is
     * on, so a `$derived` calling it is worked out again on every tick, and answers the live level when there is no
     * trail.
     */
    export const createPatternTrail = (
        getOpts: () => ReturnType<typeof TrackedPatternUtils.resolveOpts>,
        getPointer: () => Point2d | undefined,
    ) => {
        const trail = TrackedPatternUtils.createTrail();
        const trailMs = $derived(getOpts().trailMs);
        const retentionMs = $derived(getOpts().retentionMs);

        let clock = $state.raw<ReturnType<typeof SVGDefsUtils.createClock>>();

        const getFrameMs = $derived(clock ? readStore(clock.frameMs) : undefined);

        $effect(() => {
            if (!TrackedPatternUtils.getHasTrail({ trailMs, retentionMs })) return;

            const next = SVGDefsUtils.createClock(TrackedPatternUtils.getTrailSpanMs({ trailMs, retentionMs }));
            const release = next.retain();

            clock = next;

            return () => {
                release();
                clock = undefined;
            };
        });

        $effect(() => {
            if (getPointer()) clock?.keepAwake();
        });

        return (index: Index2d, liveLevel: number) => {
            const opts = getOpts();

            return getFrameMs && TrackedPatternUtils.getHasTrail(opts)
                ? trail.computeLevel(`${index.row}_${index.col}`, liveLevel, getFrameMs(), opts)
                : liveLevel;
        };
    };
}
