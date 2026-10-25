import { createEffect, onCleanup, untrack } from "solid-js";

import { FocusManagerUtils } from "@thewaver/ss-components";

/** The Solid side of {@link FocusManagerUtils}: focus moved in and back out as a signal says a layer comes and goes. */
export namespace FocusManagerSolidUtils {
    /**
     * Moves focus into an element when it appears, and back where it came from when it goes.
     *
     * {@link FocusManagerUtils.focusInto} following accessors: focus moves in once the element exists and is
     * visible, and is restored when either stops being true or the owner is disposed.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param getRef The element to focus into.
     * @param getIsVisible Whether it is currently shown.
     * @param opts.getInitialRef What to focus instead of the first focusable child — a text field
     * rather than a close button, say. Read once, when focus moves in, so a later change does not steal
     * focus from the user.
     * @param opts.getIsOpen Whether the layer is open, for one that can be hidden and shown again while it stays
     * open — covered for a while by another layer, say. Each time it hides, focus goes back to what first opened
     * it, and so it does when it closes, rather than to wherever focus was when it last showed. Without it, focus
     * goes back to wherever it was when the element last appeared.
     */
    export const autoFocus = (
        getRef: () => HTMLElement | undefined,
        getIsVisible: () => boolean,
        opts?: { getInitialRef?: () => HTMLElement | undefined; getIsOpen?: () => boolean },
    ) => {
        const originKeeper = FocusManagerUtils.createOriginKeeper();
        const getIsOpen = opts?.getIsOpen;

        if (getIsOpen) {
            createEffect(() => {
                if (!getIsOpen()) originKeeper.forget();
            });
        }

        createEffect(() => {
            const ref = getRef();
            const isVisible = getIsVisible();

            if (!ref || !isVisible) return;

            onCleanup(
                FocusManagerUtils.focusInto(ref, {
                    initialRef: untrack(() => opts?.getInitialRef?.()),
                    origin: getIsOpen ? originKeeper.take() : undefined,
                }),
            );
        });
    };
}
