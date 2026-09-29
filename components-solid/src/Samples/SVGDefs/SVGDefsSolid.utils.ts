import { createSignal, onCleanup } from "solid-js";

import { SVGDefsUtils } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import { SVGFilterDefsFactory } from "../../Generators/SVGDefs/SVGFilters/SVGFilterDefs.factory";

/**
 * The Solid half of the sample helpers: the parts that return markup or hold a signal. Everything else the
 * samples share is framework-free, in {@link SVGDefsUtils}.
 */
export namespace SVGDefsSolidUtils {
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
     * {@link SVGDefsUtils.createClock} read as a Solid signal.
     *
     * The clock is usually made once, when the sample's file loads, so the signal lives outside any component and
     * each consumer ties itself to the clock with `subscribe`, which undoes itself when that consumer is cleaned up.
     *
     * @param graceMs How long the clock keeps running after the last wake.
     * @returns The current frame time as a signal, and the `keepAwake` and `subscribe` calls.
     */
    export const createClock = (graceMs: number) => {
        const clock = SVGDefsUtils.createClock(graceMs);
        const [getFrameMs, setFrameMs] = createSignal(clock.frameMs.get());

        clock.frameMs.subscribe(() => setFrameMs(clock.frameMs.get()));

        return {
            getFrameMs,
            keepAwake: clock.keepAwake,
            subscribe: () => onCleanup(clock.retain()),
        };
    };
}
