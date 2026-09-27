import type { TableOfContentsLink } from "./TableOfContents.types";

/** The attribute that makes a heading focusable without putting it in the tab order. */
const TAB_INDEX_ATTRIBUTE = "tabindex";

/** A `tabindex` that allows focus from script and from a link, but not from tabbing. */
const PROGRAMMATIC_TAB_INDEX = "-1";

/**
 * The part of a table of contents that is not about drawing it: which section is current, and taking the reader to
 * one.
 */
export namespace TableOfContentsUtils {
    /**
     * The value of the section being read.
     *
     * @param links The links, in reading order.
     * @param currentIndex Which link's target has most recently scrolled past the line, if any has.
     * @returns That link's value, or `undefined` while the reader is above the first section.
     */
    export const computeCurrentValue = <T>(links: TableOfContentsLink<T>[], currentIndex: number | undefined) =>
        currentIndex === undefined ? undefined : links[currentIndex]?.value;

    /**
     * Makes each target able to take focus, so pressing its link can move focus onto it, until the returned function
     * is called.
     *
     * A heading cannot take focus by default, so pressing a link would scroll the page and leave focus on the link —
     * and the next Tab would carry on through the table of contents rather than into the section. Each target that
     * cannot already be focused is given a `tabindex` of `-1`, which lets it take focus without joining the tab order.
     * A target that already carries a `tabindex` of its own, or is focusable by nature, is left as it is.
     *
     * @param targets The targets, with a missing one skipped.
     * @returns The function that takes back every `tabindex` this added, and only those.
     */
    export const makeTargetsFocusable = (targets: Array<HTMLElement | undefined>) => {
        const added: HTMLElement[] = [];

        for (const target of targets) {
            if (!target || target.hasAttribute(TAB_INDEX_ATTRIBUTE) || target.tabIndex >= 0) continue;

            target.setAttribute(TAB_INDEX_ATTRIBUTE, PROGRAMMATIC_TAB_INDEX);
            added.push(target);
        }

        return () => {
            for (const target of added) target.removeAttribute(TAB_INDEX_ATTRIBUTE);
        };
    };

    /**
     * Takes the reader to a link's section: its target is scrolled to the top of the view and given focus.
     *
     * Focus is moved without a second scroll, so the target lands where the first one put it.
     *
     * @param target The element the link leads to.
     */
    export const goToTarget = (target: HTMLElement) => {
        target.scrollIntoView({ block: "start" });
        target.focus({ preventScroll: true });
    };
}
