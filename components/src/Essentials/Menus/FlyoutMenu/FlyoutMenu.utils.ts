import type { FlyoutMenuEntryRecord } from "./FlyoutMenu.types";

/** No links at all. */
const NO_LINKS = 0;

/**
 * The rules a fly-out navigation bar follows, written once for every framework's view.
 *
 * The bar follows the W3C's fly-out menu tutorial: each entry is a link to its own page, and an entry with a panel has a
 * toggle button beside its link. Hovering the entry opens its panel, the toggle opens and closes it from the keyboard or
 * a touch, and tabbing along the bar never opens anything. One panel serves every entry and glides from one to the next.
 * Entries that do not fit collapse into an overflow panel, where each keeps its link and its toggle.
 */
export namespace FlyoutMenuUtils {
    /** The position that stands for the overflow entry, which is not one of the consumer's entries. */
    export const OVERFLOW_INDEX = -1;

    /**
     * Whether an entry has a panel to open.
     *
     * @param entry The entry.
     * @returns `true` when it carries at least one link.
     */
    export const getHasPanel = <T>(entry: FlyoutMenuEntryRecord<T>) => (entry.links?.length ?? NO_LINKS) > NO_LINKS;

    /**
     * Which entry has its panel open after one entry's panel opens or closes.
     *
     * One value says which entry is open, so opening one closes whichever was open before it — which is the panel
     * gliding rather than one closing and another opening. An entry closing only clears the value when it was the one
     * open, so a late close from an entry already left does not close the panel that replaced it.
     *
     * @param open The entry open now, if any.
     * @param index The entry whose panel changed.
     * @param isOpen Whether it opened.
     */
    export const computeNextOpenIndex = (open: number | undefined, index: number, isOpen: boolean) =>
        isOpen ? index : open === index ? undefined : open;

    /**
     * Whether a hover must leave the open panel where it is.
     *
     * While focus is inside the open panel, the keyboard is working there; the pointer drifting over another entry
     * would swap the panel's links out from under it and drop the focus. So a hover may not move the panel then. It
     * closes, as usual, once focus leaves it.
     *
     * @param open The entry open now, if any.
     * @param index The entry the hover asks to open.
     * @param hasFocusInside Whether focus is inside the open panel.
     */
    export const getIsHoverSwitchRefused = (open: number | undefined, index: number, hasFocusInside: boolean) =>
        hasFocusInside && open !== undefined && open !== index;

    /**
     * The transition that carries the panel from one entry to the next while it is showing.
     *
     * Only the panel's position glides; nothing else that moves it, such as a scroll, is eased.
     *
     * @param durationMs How long the glide takes.
     */
    export const getGlideTransition = (durationMs: number) => `transform ${durationMs}ms ease`;

    /**
     * The entries the overflow panel holds, in the order they sit in the bar.
     *
     * @param entries The bar's entries.
     * @param collapsedIndexes The collapsed ones, from `OverflowUtils.computeCut`.
     * @returns The entries themselves, each still carrying its links.
     */
    export const computeCollapsedEntries = <T>(entries: FlyoutMenuEntryRecord<T>[], collapsedIndexes: number[]) =>
        collapsedIndexes.map((index) => entries[index]);
}
