import type { DismisserReason } from "../../Abstracts/Dismisser/Dismisser.types";
import { FocusManagerUtils } from "../../Abstracts/FocusManager/FocusManager.utils";
import type { HoverCardDismissal } from "./HoverCard.types";

/** The key that walks focus into, through and out of the card. */
const TAB_KEY = "Tab";

/** The pointer type whose press stands in for the hover a touch screen cannot do. */
const TOUCH_POINTER_TYPE = "touch";

/** What a key handler needs from a key event, so either framework's event will do. */
type HoverCardKeyEvent = Pick<KeyboardEvent, "key" | "shiftKey" | "preventDefault">;

/**
 * The part of a hover card that is not about drawing it: what holds it open, how Tab walks into and out of a card
 * portaled away from its anchor, and how a touch press stands in for a hover.
 */
export namespace HoverCardUtils {
    /**
     * Whether focus is somewhere inside the card.
     *
     * @param card The card's element, or `undefined` while it is not mounted.
     * @returns `true` when the focused element is the card or inside it.
     */
    export const getHasFocusInside = (card: HTMLElement | undefined) => card?.contains(document.activeElement) ?? false;

    /**
     * Whether the card should stay open although the pointer has left it and its anchor.
     *
     * Focus inside the card holds it, and so does a keyboard focus resting on the anchor, which is told from a
     * pointer press by `:focus-visible` — so Shift+Tab back to the anchor keeps the card, and a click on the anchor
     * followed by the pointer leaving does not.
     *
     * @param anchor The card's anchor.
     * @param card The card's element.
     * @returns Whether it is held.
     */
    export const getIsHeld = (anchor: HTMLElement | undefined, card: HTMLElement | undefined) => {
        if (getHasFocusInside(card)) return true;

        return anchor !== undefined && document.activeElement === anchor && anchor.matches(":focus-visible");
    };

    /**
     * How the card answers a dismissal from its layer.
     *
     * Escape closes it and, when focus was inside, puts focus back on the anchor. Focus leaving is ignored while
     * the pointer is still over the anchor or the card, since the pointer alone is reason enough to keep it.
     * Anything else closes it.
     *
     * @param reason Why the layer is being dismissed.
     * @param isPointerInside Whether the pointer is over the anchor or the card right now.
     * @returns `"restore"`, `"close"` or `"ignore"`.
     */
    export const resolveDismissal = (reason: DismisserReason, isPointerInside: boolean): HoverCardDismissal => {
        if (reason === "escape") return "restore";

        if (reason === "focus" && isPointerInside) return "ignore";

        return "close";
    };

    /**
     * Puts focus back on the anchor when it is inside the card, marked as a restore.
     *
     * The mark is what stops the anchor taking the returning focus as a fresh keyboard focus and opening the card
     * again once its wait is up.
     *
     * @param anchor The card's anchor.
     * @param card The card's element.
     */
    export const restoreFocus = (anchor: HTMLElement | undefined, card: HTMLElement | undefined) => {
        if (!anchor || !getHasFocusInside(card)) return;

        FocusManagerUtils.runFocusRestore(() => {
            anchor.focus({ preventScroll: true });
        });
    };

    /**
     * The first focusable element after the anchor in the page, not counting the card or the anchor itself.
     *
     * It is where Tab past the card's last control goes, so the walk carries on from the anchor rather than from
     * the end of the document, where the portaled card really sits.
     *
     * @param anchor The card's anchor.
     * @param card The card's element.
     * @returns The element, or `undefined` when nothing focusable follows the anchor.
     */
    export const findFocusableAfter = (anchor: HTMLElement, card: HTMLElement) =>
        FocusManagerUtils.getFocusableChildren().find(
            (element) =>
                !card.contains(element) &&
                !anchor.contains(element) &&
                (anchor.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0,
        );

    /**
     * Answers a key pressed inside the card: Shift+Tab from its start goes back to the anchor, and Tab from its end
     * goes on to whatever follows the anchor.
     *
     * Every other key, and Tab anywhere in between, is left to the browser.
     *
     * @param e The key event.
     * @param anchor The card's anchor.
     * @param card The card's element.
     */
    export const handleCardKeyDown = (
        e: HoverCardKeyEvent,
        anchor: HTMLElement | undefined,
        card: HTMLElement | undefined,
    ) => {
        if (e.key !== TAB_KEY || !anchor || !card) return;

        const focusable = FocusManagerUtils.getFocusableChildren(card);
        const active = document.activeElement;

        if (e.shiftKey) {
            if (active !== card && active !== focusable[0]) return;

            e.preventDefault();
            anchor.focus({ preventScroll: true });

            return;
        }

        if (active !== (focusable.at(-1) ?? card)) return;

        const next = findFocusableAfter(anchor, card);

        if (!next) return;

        e.preventDefault();
        next.focus({ preventScroll: true });
    };

    /**
     * Listens on the anchor for what a card needs from it: Tab moving into an open card, and a touch press opening
     * and closing it where there is no hover.
     *
     * @param anchor The card's anchor.
     * @param defs.getIsOpen Reads whether the card is open, at the moment Tab is pressed.
     * @param defs.getCard Reads the card's element, at the same moment.
     * @param defs.onTouchPress Called for a press that came from a touch, which should open a closed card and close
     * an open one.
     * @returns The function that stops listening.
     */
    export const observeAnchor = (
        anchor: HTMLElement,
        defs: { getIsOpen: () => boolean; getCard: () => HTMLElement | undefined; onTouchPress: () => void },
    ) => {
        let lastPointerType: string | undefined;

        const handlePointerDown = (e: PointerEvent) => {
            lastPointerType = e.pointerType;
        };

        const handleClick = () => {
            const pointerType = lastPointerType;

            lastPointerType = undefined;

            if (pointerType !== TOUCH_POINTER_TYPE) return;

            defs.onTouchPress();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== TAB_KEY || e.shiftKey || !defs.getIsOpen()) return;

            const first = FocusManagerUtils.getFirstFocusableChild(defs.getCard());

            if (!first) return;

            e.preventDefault();
            first.focus({ preventScroll: true });
        };

        anchor.addEventListener("pointerdown", handlePointerDown);
        anchor.addEventListener("click", handleClick);
        anchor.addEventListener("keydown", handleKeyDown);

        return () => {
            anchor.removeEventListener("pointerdown", handlePointerDown);
            anchor.removeEventListener("click", handleClick);
            anchor.removeEventListener("keydown", handleKeyDown);
        };
    };
}
