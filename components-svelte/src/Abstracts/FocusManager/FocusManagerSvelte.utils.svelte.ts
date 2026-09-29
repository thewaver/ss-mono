import { untrack } from "svelte";

import { FocusManagerUtils } from "@thewaver/ss-components";

/**
 * The Svelte side of {@link FocusManagerUtils}: focus moved in and back out as a getter says a layer comes and goes.
 */
export namespace FocusManagerSvelteUtils {
    /**
     * Moves focus into an element when it appears, and back where it came from when it goes.
     *
     * {@link FocusManagerUtils.focusInto} following getters: focus moves in once the element exists and is visible,
     * and is restored when either stops being true or the component is destroyed.
     *
     * Must run while a component is being set up.
     *
     * @param getRef The element to focus into.
     * @param getIsVisible Whether it is currently shown.
     * @param opts.getInitialRef What to focus instead of the first focusable child — a text field rather than a
     * close button, say. Read once, when focus moves in, so a later change does not steal focus from the user.
     */
    export const autoFocus = (
        getRef: () => HTMLElement | undefined,
        getIsVisible: () => boolean,
        opts?: { getInitialRef?: () => HTMLElement | undefined },
    ) => {
        $effect(() => {
            const ref = getRef();
            const isVisible = getIsVisible();

            if (!ref || !isVisible) return;

            return untrack(() => FocusManagerUtils.focusInto(ref, { initialRef: opts?.getInitialRef?.() }));
        });
    };
}
