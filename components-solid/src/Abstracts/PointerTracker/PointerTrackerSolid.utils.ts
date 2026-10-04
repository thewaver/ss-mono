import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

import { type PointSource, PointerTrackerUtils } from "@thewaver/ss-components";

import { useViewportContext } from "../Viewport/Viewport.context";

/** Whether the pointer is over the window, as a signal shared by every Solid tracker. */
const [getIsPointerPresent, setIsPointerPresent] = createSignal(PointerTrackerUtils.presence.get());

PointerTrackerUtils.presence.subscribe(() => setIsPointerPresent(PointerTrackerUtils.presence.get()));

/** The Solid side of {@link PointerTrackerUtils}: where the pointer is relative to an element, as signals. */
export namespace PointerTrackerSolidUtils {
    /**
     * Tracks one element.
     *
     * {@link PointerTrackerUtils.observe} following accessors, in the enclosing viewport's coordinates.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param getRef The element to track. Nothing is measured until it exists.
     * @param getIsDisabled Pass `true` to stop tracking; the element stops contributing to the shared
     * listeners entirely.
     * @param getSource The point to follow in place of the pointer. Left out, or answering `undefined`, the
     * pointer is followed. A new value is measured on the next frame.
     * @returns `getReading` and `getIsPointerPresent`. The reading is what {@link PointerTrackerUtils.observe}
     * reports, and starts at {@link PointerTrackerUtils.RESTING}. `getIsPointerPresent` is `false` before the
     * pointer is first seen, after it leaves the window, and when the window loses focus — or, with a source, while
     * the source has no point — which is what an effect should fall back to a resting state on.
     */
    export const create = (
        getRef: Accessor<HTMLElement | undefined>,
        getIsDisabled?: Accessor<boolean>,
        getSource?: Accessor<PointSource | undefined>,
    ) => {
        const viewportContext = useViewportContext();
        const [getReading, setReading] = createSignal(PointerTrackerUtils.RESTING, {
            equals: PointerTrackerUtils.getIsSame,
        });

        createEffect(() => {
            const ref = getRef();

            if (!ref || getIsDisabled?.()) return;

            onCleanup(PointerTrackerUtils.observe(ref, viewportContext, setReading, getSource));
        });

        createEffect(() => {
            if (getSource?.()) PointerTrackerUtils.refresh();
        });

        return {
            getReading,
            getIsPointerPresent: () => PointerTrackerUtils.getIsPresent(getSource?.(), getIsPointerPresent()),
        };
    };
}
