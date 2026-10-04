import { type MaybeRefOrGetter, type Ref, computed, shallowRef, toValue } from "vue";

import { type PointSource, type PointerReading, PointerTrackerUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";
import { useStore } from "../../Utils/storeUtils";
import { useViewportContext } from "../Viewport/Viewport.context";

/** The Vue side of `PointerTrackerUtils`: where the pointer is relative to an element, as refs. */
export namespace PointerTrackerVueUtils {
    /**
     * Tracks one element.
     *
     * `PointerTrackerUtils.observe` while the element exists and tracking is on, in the nearest viewport's
     * coordinates.
     *
     * Must run inside a component's `setup`.
     *
     * @param ref The element to track.
     * @param isDisabled Pass `true` to stop tracking; the element stops contributing to the shared listeners.
     * @param source The point to follow in place of the pointer. Left out, or reading `undefined`, the pointer is
     * followed. A new value is measured on the next frame.
     * @returns `reading`, a ref of what `PointerTrackerUtils.observe` reports, starting at
     * `PointerTrackerUtils.RESTING`, and `isPointerPresent`, a ref that is `false` before the pointer is first seen,
     * after it leaves the window, and when the window loses focus — or, with a source, while the source has no point.
     */
    export const usePointerReading = (
        ref: MaybeRefOrGetter<HTMLElement | null | undefined>,
        isDisabled: MaybeRefOrGetter<boolean> = false,
        source: MaybeRefOrGetter<PointSource | undefined> = undefined,
    ) => {
        const viewportContext = useViewportContext();
        const reading = shallowRef<PointerReading>(PointerTrackerUtils.RESTING);

        watchAfterRender([() => toValue(ref), () => toValue(isDisabled)], ([element, isOff]) => {
            if (!element || isOff) return;

            return PointerTrackerUtils.observe(
                element,
                viewportContext,
                (next) => {
                    if (!PointerTrackerUtils.getIsSame(reading.value, next)) reading.value = next;
                },
                () => toValue(source),
            );
        });

        watchAfterRender([() => toValue(source)], ([next]) => {
            if (next) PointerTrackerUtils.refresh();
        });

        const isGlobalPointerPresent = useStore(PointerTrackerUtils.presence);

        return {
            reading: reading as Readonly<Ref<PointerReading>>,
            isPointerPresent: computed(() =>
                PointerTrackerUtils.getIsPresent(toValue(source), isGlobalPointerPresent.value),
            ),
        };
    };
}
