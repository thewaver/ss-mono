import type { Index2d, Size2d } from "@thewaver/ss-utils";
/**
 * The Svelte half of the sample helpers: the parts that return markup or follow a clock. Everything else the samples
 * share is framework-free, in {@link SVGDefsUtils}.
 */
export declare namespace SVGDefsSvelteUtils {
    /**
     * The soft-edge filter a sample puts on its paint, when it asks for one.
     *
     * @param id The sample's id, from which the filter's own id is made.
     * @param defs.getSize The painted element's size, which the filter's region is fitted to.
     * @param defs.blurWidth How far the blur spreads; `0` or absent means no filter.
     * @returns A filter def to hand to a paint's `filter`, or `undefined` when no blur was asked for.
     */
    const getBaseBlur: (id: string, defs: {
        getSize: () => Size2d;
        blurWidth?: number;
    }) => {
        id: string;
        renderDefsElement: () => import("../../index.js").MarkupElement<{
            filterId: string;
            assembly: import("@thewaver/ss-components").SVGFilterAssembly;
            primitives: {
                [x: string]: import("../../Generators/SVGDefs/SVGFilters/SVGFilterDefsSvelte.types.js").SVGFilterPrimitive;
            };
        }> | undefined;
    } | undefined;
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
    const createClock: (graceMs: number) => {
        getFrameMs: () => number;
        keepAwake: () => void;
        subscribe: () => void;
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
    const createSplitValues: () => (cellId: string, index: Index2d, cellCount: {
        rows: number;
        cols: number;
    }, isSplit: boolean) => string;
}
