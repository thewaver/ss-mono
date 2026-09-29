import type { PopoverRole } from "./Popover.types";

/** How far a scroller must move along one axis to show a run of `itemSize` from `itemStart`, the least that does. */
const getRevealShift = (viewStart: number, viewSize: number, itemStart: number, itemSize: number) => {
    const startShift = itemStart - viewStart;
    const endShift = itemStart + itemSize - (viewStart + viewSize);

    if (startShift < 0) return startShift;
    if (endShift > 0) return Math.min(startShift, endShift);

    return 0;
};

/** Moves one scroller by the least that shows `element`, converting the painted distance into its layout pixels. */
const revealIn = (scroller: HTMLElement, element: HTMLElement) => {
    const canScrollX = scroller.scrollWidth > scroller.clientWidth;
    const canScrollY = scroller.scrollHeight > scroller.clientHeight;

    if ((!canScrollX && !canScrollY) || scroller.offsetWidth === 0) return;

    const scrollerRect = scroller.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const scale = scrollerRect.width / scroller.offsetWidth;

    if (canScrollX) {
        const viewStart = scrollerRect.left + scroller.clientLeft * scale;

        scroller.scrollLeft +=
            getRevealShift(viewStart, scroller.clientWidth * scale, elementRect.left, elementRect.width) / scale;
    }

    if (canScrollY) {
        const viewStart = scrollerRect.top + scroller.clientTop * scale;

        scroller.scrollTop +=
            getRevealShift(viewStart, scroller.clientHeight * scale, elementRect.top, elementRect.height) / scale;
    }
};

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

    /**
     * Scrolls an element into view by moving only the scrollers between it and `root`, never the page.
     *
     * `scrollIntoView` moves every scrollable ancestor, the document included, and a popup that has just opened is
     * still unplaced at the top-left corner of whatever it is portaled into — with no `Viewport`, the top of the
     * document — so revealing its highlighted row there scrolled the page to the top. This moves each scroller from the
     * element's parent up to and including `root` by the least that shows the element, as `block: "nearest"` does,
     * and nothing outside `root`. Where the popup has been placed makes no difference to the answer, so it may be
     * called the moment the popup mounts. Distances are converted into each scroller's own layout pixels, so content
     * drawn inside a scaled `Viewport` scrolls by the right amount.
     *
     * @param element The element to show.
     * @param root The outermost element allowed to scroll: a popup's root, or a control's own root when the control
     * may be drawn inside a popup. Nothing moves when `element` is not inside it.
     */
    export const revealWithin = (element: HTMLElement, root: HTMLElement) => {
        if (!root.contains(element)) return;

        for (let scroller = element.parentElement; scroller; scroller = scroller.parentElement) {
            revealIn(scroller, element);

            if (scroller === root) return;
        }
    };
}
