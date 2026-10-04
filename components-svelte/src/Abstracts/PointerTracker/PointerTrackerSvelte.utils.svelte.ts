import { untrack } from "svelte";

import { type PointSource, type PointerReading, PointerTrackerUtils } from "@thewaver/ss-components";

import { readStore } from "../../Utils/storeUtils.js";
import { getViewportContext } from "../Viewport/Viewport.context.js";

const getIsPointerPresent = readStore(PointerTrackerUtils.presence);

/** The Svelte side of {@link PointerTrackerUtils}: where the pointer is relative to an element, as getters. */
export namespace PointerTrackerSvelteUtils {
    /**
     * Tracks one element.
     *
     * {@link PointerTrackerUtils.observe} following getters, in the enclosing viewport's coordinates.
     *
     * Must run while a component is being set up.
     *
     * @param getRef The element to track. Nothing is measured until it exists.
     * @param getIsDisabled Pass `true` to stop tracking; the element stops contributing to the shared listeners
     * entirely.
     * @param getSource The point to follow in place of the pointer. Left out, or answering `undefined`, the pointer
     * is followed. A new value is measured on the next frame.
     * @returns `getReading` and `getIsPointerPresent`. The reading is what {@link PointerTrackerUtils.observe}
     * reports, and starts at {@link PointerTrackerUtils.RESTING}. `getIsPointerPresent` is `false` before the pointer
     * is first seen, after it leaves the window, and when the window loses focus — or, with a source, while the
     * source has no point — which is what an effect should fall back to a resting state on.
     */
    export const create = (
        getRef: () => HTMLElement | undefined,
        getIsDisabled?: () => boolean,
        getSource?: () => PointSource | undefined,
    ) => {
        const viewportContext = getViewportContext();

        let reading = $state.raw<PointerReading>(PointerTrackerUtils.RESTING);

        $effect(() => {
            const ref = getRef();

            if (!ref || getIsDisabled?.()) return;

            return untrack(() =>
                PointerTrackerUtils.observe(
                    ref,
                    viewportContext,
                    (next) => {
                        if (!PointerTrackerUtils.getIsSame(reading, next)) reading = next;
                    },
                    getSource,
                ),
            );
        });

        $effect(() => {
            if (getSource?.()) untrack(PointerTrackerUtils.refresh);
        });

        return {
            getReading: () => reading,
            getIsPointerPresent: () => PointerTrackerUtils.getIsPresent(getSource?.(), getIsPointerPresent()),
        };
    };
}
