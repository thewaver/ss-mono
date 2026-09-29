import { type NavigatorDirection } from "@thewaver/ss-components";
/**
 * The Svelte side of {@link NavigatorUtils}: the parts of an arrow-key walk that have to follow the page as it
 * changes. The arithmetic itself is framework-free and is used from {@link NavigatorUtils} directly.
 */
export declare namespace NavigatorSvelteUtils {
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
     * @returns `"rtl"` when the element's text runs right to left, and `"ltr"` otherwise — including before the
     * element exists.
     */
    const createDirection: (getRef: () => HTMLElement | undefined) => (() => NavigatorDirection);
}
