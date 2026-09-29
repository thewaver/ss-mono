import type { Attachment } from "svelte/attachments";

/**
 * Notes every element in a subtree that has been scrolled away from its start, and where to, so the scroll can be
 * put back after the subtree is moved.
 *
 * @param element The root of the subtree, itself included.
 * @returns A function that writes each noted element's scroll position back.
 */
const holdScroll = (element: Element) => {
    const scrolled = [element, ...element.querySelectorAll("*")]
        .filter((node) => node.scrollTop !== 0 || node.scrollLeft !== 0)
        .map((node) => ({ node, top: node.scrollTop, left: node.scrollLeft }));

    return () =>
        scrolled.forEach(({ node, top, left }) => {
            node.scrollTop = top;
            node.scrollLeft = left;
        });
};

/**
 * Moves an element to the end of another one for as long as it exists, which is how a popup leaves the layout it
 * was declared in.
 *
 * Svelte has no portal of its own, so a layer that must escape its ancestors' clipping and stacking — a tooltip, a
 * popover, a spotlight — attaches this to its outermost element. A new target moves the element again. The element is
 * removed when its block ends, wherever it has been moved to, and that includes a block torn down along with an
 * ancestor's, such as a submenu inside a menu that closes: the attachment takes the element out itself, since Svelte
 * only removes the outermost nodes of what it tears down and a moved element is no longer among them. Give the element
 * an `{#if}` of its own all the same, so that when its block ends on its own nothing next to it is looked for beside it
 * in its new place.
 *
 * The move runs after the effects of what the element holds, so anything they scrolled — a popup's highlighted row
 * revealed the moment it mounts — is scrolled again once the element has arrived: taking an element out of the
 * document drops the scroll position of everything inside it.
 *
 * Events still reach the element's own handlers, which Svelte listens for on the document as well as on the app's
 * root. They do not reach handlers on the components around where it was declared, since an event travels through
 * the document rather than through the component tree.
 *
 * @param target Where to move the element, usually the viewport's portal element or `document.body`.
 * @returns An attachment, for `{@attach}` on the element to move.
 */
export const attachPortal =
    (target: HTMLElement): Attachment<HTMLElement> =>
    (element) => {
        const restoreScroll = holdScroll(element);

        target.appendChild(element);
        restoreScroll();

        return () => element.remove();
    };
