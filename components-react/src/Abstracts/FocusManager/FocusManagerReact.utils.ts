import { type RefObject, useEffect, useState } from "react";

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
     * @param opts.isOpen Whether the layer is open, for one that can be hidden and shown again while it stays
     * open — covered for a while by another layer, say. Each time it hides, focus goes back to what first opened
     * it, and so it does when it closes, rather than to wherever focus was when it last showed. Without it, focus
     * goes back to wherever it was when the element last appeared.
     */
    export const useAutoFocus = (
        ref: RefObject<HTMLElement | null>,
        isVisible: boolean,
        opts?: { initialRef?: RefObject<HTMLElement | null>; isOpen?: boolean },
    ) => {
        const element = useElement(ref);
        const latest = useLatest(opts);
        const [originKeeper] = useState(FocusManagerUtils.createOriginKeeper);
        const isOpen = opts?.isOpen;

        useEffect(() => {
            if (isOpen === false) originKeeper.forget();
        }, [isOpen, originKeeper]);

        useEffect(() => {
            if (!element || !isVisible) return;

            return FocusManagerUtils.focusInto(element, {
                initialRef: latest.current?.initialRef?.current ?? undefined,
                origin: latest.current?.isOpen === undefined ? undefined : originKeeper.take(),
            });
        }, [element, isVisible, latest, originKeeper]);
    };
}
