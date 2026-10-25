import { type MaybeRefOrGetter, toValue, watch } from "vue";

import { FocusManagerUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";

/** The Vue side of `FocusManagerUtils`: focus moved in and back out as a layer comes and goes. */
export namespace FocusManagerVueUtils {
    /**
     * Moves focus into an element when it appears, and back where it came from when it goes.
     *
     * `FocusManagerUtils.focusInto` following its arguments: focus moves in once the element exists and is visible,
     * and is restored when either stops being true or the component unmounts.
     *
     * Must run inside a component's `setup`.
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
        ref: MaybeRefOrGetter<HTMLElement | null | undefined>,
        isVisible: MaybeRefOrGetter<boolean>,
        opts?: {
            initialRef?: MaybeRefOrGetter<HTMLElement | null | undefined>;
            isOpen?: MaybeRefOrGetter<boolean>;
        },
    ) => {
        const originKeeper = FocusManagerUtils.createOriginKeeper();
        const isOpen = opts?.isOpen;

        if (isOpen !== undefined) {
            watch(
                () => toValue(isOpen),
                (isNowOpen) => {
                    if (!isNowOpen) originKeeper.forget();
                },
            );
        }

        watchAfterRender([() => toValue(ref), () => toValue(isVisible)], ([element, isShown]) => {
            if (!element || !isShown) return;

            return FocusManagerUtils.focusInto(element, {
                initialRef: toValue(opts?.initialRef) ?? undefined,
                origin: isOpen === undefined ? undefined : originKeeper.take(),
            });
        });
    };
}
