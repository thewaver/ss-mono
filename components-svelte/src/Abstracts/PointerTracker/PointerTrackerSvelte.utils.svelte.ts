import { untrack } from "svelte";

import { type PointerReading, PointerTrackerUtils } from "@thewaver/ss-components";

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
     * @returns `getReading` and `getIsPointerPresent`. The reading is what {@link PointerTrackerUtils.observe}
     * reports, and starts at {@link PointerTrackerUtils.RESTING}. `getIsPointerPresent` is shared by every tracker
     * and is `false` before the pointer is first seen, after it leaves the window, and when the window loses focus —
     * which is what an effect should fall back to a resting state on.
     */
    export const create = (getRef: () => HTMLElement | undefined, getIsDisabled?: () => boolean) => {
        const viewportContext = getViewportContext();

        let reading = $state.raw<PointerReading>(PointerTrackerUtils.RESTING);

        $effect(() => {
            const ref = getRef();

            if (!ref || getIsDisabled?.()) return;

            return untrack(() =>
                PointerTrackerUtils.observe(ref, viewportContext, (next) => {
                    if (!PointerTrackerUtils.getIsSame(reading, next)) reading = next;
                }),
            );
        });

        return { getReading: () => reading, getIsPointerPresent };
    };
}
