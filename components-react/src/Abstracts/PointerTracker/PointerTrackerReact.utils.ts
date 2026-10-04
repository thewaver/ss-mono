import { type RefObject, useEffect, useState } from "react";

import { type PointSource, type PointerReading, PointerTrackerUtils } from "@thewaver/ss-components";

import { useElement, useLatest } from "../../Utils/refUtils";
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
     * @param source The point to follow in place of the pointer. Left out, or `undefined`, the pointer is followed.
     * A source built afresh on every render costs nothing while its point and element stay the same; a new point is
     * measured on the next frame.
     * @returns `reading`, as `PointerTrackerUtils.observe` reports it and starting at `PointerTrackerUtils.RESTING`,
     * and `isPointerPresent`: `false` before the pointer is first seen, after it leaves the window, and when the
     * window loses focus — or, with a source, while the source has no point.
     */
    export const usePointerReading = (ref: RefObject<HTMLElement | null>, isDisabled = false, source?: PointSource) => {
        const viewportContext = useViewportContext();
        const element = useElement(ref);
        const [reading, setReading] = useState<PointerReading>(PointerTrackerUtils.RESTING);
        const sourceRef = useLatest(source);
        const isGlobalPresent = useStore(PointerTrackerUtils.presence);

        useEffect(() => {
            if (!element || isDisabled) return;

            return PointerTrackerUtils.observe(
                element,
                viewportContext,
                (next) => setReading((previous) => (PointerTrackerUtils.getIsSame(previous, next) ? previous : next)),
                () => sourceRef.current,
            );
        }, [element, isDisabled, viewportContext, sourceRef]);

        useEffect(() => {
            if (source) PointerTrackerUtils.refresh();
        }, [source?.ratio?.x, source?.ratio?.y, source?.element]);

        return { reading, isPointerPresent: PointerTrackerUtils.getIsPresent(source, isGlobalPresent) };
    };
}
