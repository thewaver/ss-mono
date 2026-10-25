import { untrack } from "svelte";

import { type NavigatorDirection, NavigatorUtils } from "@thewaver/ss-components";

import { readStore } from "../../Utils/storeUtils.js";

/**
 * The Svelte side of {@link NavigatorUtils}: the parts of an arrow-key walk that have to follow the page as it
 * changes. The arithmetic itself is framework-free and is used from {@link NavigatorUtils} directly.
 */
export namespace NavigatorSvelteUtils {
    /**
     * Which way text runs at an element, kept current as the page changes.
     *
     * {@link NavigatorUtils.createDirectionWatcher} as a getter. The element is observed once the component has
     * mounted and whenever `getRef` hands over a different one, and is let go when the component is destroyed.
     *
     * Must run while a component is being set up.
     *
     * @param getRef The element to read, usually the component's own root. For a component whose popup is moved
     * elsewhere in the document, pass the element that stays in place, such as its trigger.
     * @param getIsDisabled Stops watching while it says `true`, for something that needs the direction only while it
     * is shown, such as a popup: a closed one then adds nothing to the page's work. Each time it turns `false` the
     * element is read afresh; while it is `true` the last direction read is kept. Left out, the element is watched for
     * as long as the component lives.
     * @returns `"rtl"` when the element's text runs right to left, and `"ltr"` otherwise — including before the
     * element has first been read.
     */
    export const createDirection = (
        getRef: () => HTMLElement | undefined,
        getIsDisabled?: () => boolean,
    ): (() => NavigatorDirection) => {
        const watcher = NavigatorUtils.createDirectionWatcher();
        const getDirection = readStore(watcher);

        $effect(() => {
            const ref = getRef();
            const isDisabled = getIsDisabled?.() ?? false;

            if (!ref || isDisabled) return;

            return untrack(() => watcher.observe(ref));
        });

        return getDirection;
    };
}
