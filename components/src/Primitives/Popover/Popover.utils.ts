import type { PopoverRole } from "./Popover.types";

/** The parts of a popover that are not about where it is drawn: when it gives up, and what a press inside it does. */
export namespace PopoverUtils {
    /**
     * Decides whether a pinned popup has lost its anchor, from the previous answer and what is true now.
     *
     * A pinned popup stays where it opened rather than following its anchor, so the one thing that can strand it is
     * the anchor scrolling away. The popup is only given up once the anchor has been seen on screen and then left it
     * — an anchor that starts off screen is not a reason to close. Closing the popup, or unpinning it, forgets the
     * anchor was ever seen, so the next opening starts over. Call it whenever any of the three inputs changes, and
     * keep `hasSeenAnchor` for the next call.
     *
     * @param hasSeenAnchor The answer from the previous call, `false` before the first.
     * @param isOpen Whether the popup is open.
     * @param isPinned Whether it is pinned.
     * @param isAnchorOnScreen Whether the anchor is on screen now.
     * @returns The presence to keep, and `isGone`, which is `true` on every call where the popup should be dismissed.
     */
    export const computeAnchorPresence = (
        hasSeenAnchor: boolean,
        isOpen: boolean,
        isPinned: boolean,
        isAnchorOnScreen: boolean,
    ): { hasSeenAnchor: boolean; isGone: boolean } => {
        if (!isOpen || !isPinned) return { hasSeenAnchor: false, isGone: false };

        if (isAnchorOnScreen) return { hasSeenAnchor: true, isGone: false };

        return { hasSeenAnchor, isGone: hasSeenAnchor };
    };

    /**
     * Whether a press inside the popup should leave focus where it already is.
     *
     * A listbox or a menu is driven from somewhere else — the field that owns the list, the trigger that opened the
     * menu — so a press on one of its options must not pull focus away from that owner, and the press's default is
     * prevented. A dialog is somewhere the reader works, so a press inside it focuses what it lands on as usual.
     *
     * @param role The popup's role.
     * @returns `true` when the press's default should be prevented.
     */
    export const getIsFocusKeptOnPress = (role: PopoverRole) => role !== "dialog";
}
