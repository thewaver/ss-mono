import { type RefObject, useEffect, useState } from "react";

import { type NavigatorDirection, NavigatorUtils } from "@thewaver/ss-components";

import { useElement } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";

/**
 * The React side of `NavigatorUtils`: the parts of an arrow-key walk that have to follow the page as it
 * changes. The arithmetic itself is framework-free and is used from `NavigatorUtils` directly.
 */
export namespace NavigatorReactUtils {
    /**
     * Which way text runs at an element, kept current as the page changes.
     *
     * `NavigatorUtils.createDirectionWatcher` as a hook. The element is observed once it has mounted, observed
     * afresh whenever `ref` comes to point at a different element, and let go on unmount.
     *
     * @param ref The element to read, usually the component's own root. For a component whose popup is moved
     * elsewhere in the document, pass the element that stays in place, such as its trigger.
     * @returns `"rtl"` when the element's text runs right to left, and `"ltr"` otherwise — including before the
     * element exists.
     */
    export const useDirection = (ref: RefObject<HTMLElement | null>): NavigatorDirection => {
        const [watcher] = useState(NavigatorUtils.createDirectionWatcher);
        const element = useElement(ref);

        useEffect(() => (element ? watcher.observe(element) : undefined), [watcher, element]);

        return useStore(watcher);
    };
}
