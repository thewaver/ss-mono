import { type RefObject, useEffect, useState } from "react";

import { type PointerReading, PointerTrackerUtils } from "@thewaver/ss-components";

import { useElement } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";
import { useViewportContext } from "../Viewport/Viewport.context";

/** The React side of `PointerTrackerUtils`: where the pointer is relative to an element, as state. */
export namespace PointerTrackerReactUtils {
    /**
     * Tracks one element.
     *
     * `PointerTrackerUtils.observe` while the element exists and tracking is on, in the nearest viewport's
     * coordinates.
     *
     * @param ref The element to track.
     * @param isDisabled Pass `true` to stop tracking; the element stops contributing to the shared listeners.
     * @returns `reading`, as `PointerTrackerUtils.observe` reports it and starting at `PointerTrackerUtils.RESTING`,
     * and `isPointerPresent`, shared by every tracker: `false` before the pointer is first seen, after it leaves
     * the window, and when the window loses focus.
     */
    export const usePointerReading = (ref: RefObject<HTMLElement | null>, isDisabled = false) => {
        const viewportContext = useViewportContext();
        const element = useElement(ref);
        const [reading, setReading] = useState<PointerReading>(PointerTrackerUtils.RESTING);

        useEffect(() => {
            if (!element || isDisabled) return;

            return PointerTrackerUtils.observe(element, viewportContext, (next) =>
                setReading((previous) => (PointerTrackerUtils.getIsSame(previous, next) ? previous : next)),
            );
        }, [element, isDisabled, viewportContext]);

        return { reading, isPointerPresent: useStore(PointerTrackerUtils.presence) };
    };
}
