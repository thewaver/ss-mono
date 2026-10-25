import { type MaybeRefOrGetter, toValue } from "vue";

import { NavigatorUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";
import { useStore } from "../../Utils/storeUtils";

/**
 * The Vue side of `NavigatorUtils`: the parts of an arrow-key walk that have to follow the page as it changes. The
 * arithmetic itself is framework-free and is used from `NavigatorUtils` directly.
 */
export namespace NavigatorVueUtils {
    /**
     * Which way text runs at an element, kept current as the page changes.
     *
     * `NavigatorUtils.createDirectionWatcher` as a composable. The element is observed once the component has
     * rendered, observed afresh whenever `ref` comes to point at a different element, and let go on unmount.
     *
     * Must run inside a component's `setup`.
     *
     * @param ref The element to read, usually the component's own root. For a component whose popup is moved
     * elsewhere in the document, pass the element that stays in place, such as its trigger.
     * @param isDisabled Stops watching while it says `true`, for something that needs the direction only while it
     * is shown, such as a popup: a closed one then adds nothing to the page's work. Each time it turns `false` the
     * element is read afresh; while it is `true` the last direction read is kept. Left out, the element is watched
     * for as long as the component lives.
     * @returns A ref that is `"rtl"` when the element's text runs right to left, and `"ltr"` otherwise — including
     * before the element has first been read.
     */
    export const useDirection = (
        ref: MaybeRefOrGetter<HTMLElement | null | undefined>,
        isDisabled?: MaybeRefOrGetter<boolean>,
    ) => {
        const watcher = NavigatorUtils.createDirectionWatcher();

        watchAfterRender([() => toValue(ref), () => toValue(isDisabled) ?? false], ([element, isStopped]) =>
            element && !isStopped ? watcher.observe(element) : undefined,
        );

        return useStore(watcher);
    };
}
