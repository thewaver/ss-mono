/**
 * Moves an element to the end of another one for as long as it exists, which is how a popup leaves the layout it
 * was declared in.
 *
 * Svelte has no portal of its own, so a layer that must escape its ancestors' clipping and stacking — a tooltip, a
 * popover, a spotlight — attaches this to its outermost element. A new target moves the element again. Svelte still
 * removes the element when its block ends, wherever it has been moved to, provided the element is the only node of
 * its block: give it an `{#if}` of its own, so nothing next to it is looked for beside it in its new place.
 *
 * Events still reach the element's own handlers, which Svelte listens for on the document as well as on the app's
 * root. They do not reach handlers on the components around where it was declared, since an event travels through
 * the document rather than through the component tree.
 *
 * @param target Where to move the element, usually the viewport's portal element or `document.body`.
 * @returns An attachment, for `{@attach}` on the element to move.
 */
export const attachPortal = (target) => (element) => {
    target.appendChild(element);
};
