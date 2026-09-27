import { type RefObject, useEffect } from "react";

import { FocusManagerUtils } from "@thewaver/ss-components";

import { useElement, useLatest } from "../../Utils/refUtils";

/** The React side of `FocusManagerUtils`: focus moved in and back out as a layer comes and goes. */
export namespace FocusManagerReactUtils {
    /**
     * Moves focus into an element when it appears, and back where it came from when it goes.
     *
     * `FocusManagerUtils.focusInto` following its arguments: focus moves in once the element exists and is
     * visible, and is restored when either stops being true or the component unmounts.
     *
     * @param ref The element to focus into.
     * @param isVisible Whether it is currently shown.
     * @param opts.initialRef What to focus instead of the first focusable child — a text field rather than a close
     * button, say. Read once, when focus moves in, so a later change does not steal focus from the user.
     */
    export const useAutoFocus = (
        ref: RefObject<HTMLElement | null>,
        isVisible: boolean,
        opts?: { initialRef?: RefObject<HTMLElement | null> },
    ) => {
        const element = useElement(ref);
        const latest = useLatest(opts);

        useEffect(() => {
            if (!element || !isVisible) return;

            return FocusManagerUtils.focusInto(element, {
                initialRef: latest.current?.initialRef?.current ?? undefined,
            });
        }, [element, isVisible, latest]);
    };
}
