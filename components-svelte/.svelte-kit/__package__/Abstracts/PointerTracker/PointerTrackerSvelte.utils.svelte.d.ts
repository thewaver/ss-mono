import { type PointerReading } from "@thewaver/ss-components";
/** The Svelte side of {@link PointerTrackerUtils}: where the pointer is relative to an element, as getters. */
export declare namespace PointerTrackerSvelteUtils {
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
    const create: (getRef: () => HTMLElement | undefined, getIsDisabled?: () => boolean) => {
        getReading: () => PointerReading;
        getIsPointerPresent: () => boolean;
    };
}
