import { createEffect, onCleanup, untrack } from "solid-js";

/** Everything the platform makes focusable by default, plus anything given a tab stop of its own. */
const FOCUSABLE_SELECTOR = [
    "a[href]",
    "area[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "audio[controls]",
    "video[controls]",
    "details > summary:first-of-type",
    "iframe",
    "object",
    "embed",
    "[contenteditable]:not([contenteditable='false'])",
    "[tabindex]:not([tabindex='-1'])",
].join(",");

/**
 * Whether an element found by the selector can really be tabbed to.
 *
 * The selector matches on markup, which is not the whole story: an element can be inside an
 * `inert` or `aria-hidden` subtree, or hidden by CSS, and still match. This is the part that has
 * to consult the rendered document.
 */
const isReachable = (element: HTMLElement) => {
    if (element.getAttribute("tabindex") === "-1") return false;
    if (element.closest("[inert]")) return false;
    if (element.closest("[aria-hidden='true']")) return false;
    if (element.offsetParent === null && element.getClientRects().length === 0) return false;

    return getComputedStyle(element).visibility !== "hidden";
};

/** How many focus restores are in flight. A counter rather than a flag, since nested layers can close together. */
let restoreDepth = 0;

/**
 * Finds what can be focused inside an element, traps Tab within it, and puts focus back afterwards.
 *
 * Between them these cover what a dialog or a popover owes its keyboard user: focus moves into the
 * layer when it opens, Tab cycles inside it rather than escaping into the page behind, and focus
 * returns to whatever had it when the layer closes.
 */
export namespace FocusManagerUtils {
    /**
     * Whether focus is currently being put back by a layer that has just closed.
     *
     * A `focusout` handler cannot otherwise tell a user tabbing away from a layer returning focus to
     * its trigger, and treating the second as the first closes the parent layer as well. Anything
     * reacting to focus movement should check this and stand down.
     */
    export const getIsRestoringFocus = () => restoreDepth > 0;

    /**
     * Marks a focus move as a restore, so focus handlers elsewhere know to ignore it.
     *
     * The mark is lifted a tick later rather than immediately, because the `focusout` and `focusin`
     * events the move causes are delivered after the call returns.
     *
     * @param restore Does the focusing.
     */
    export const runFocusRestore = (restore: () => void) => {
        restoreDepth++;

        try {
            restore();
        } finally {
            setTimeout(() => {
                restoreDepth--;
            }, 0);
        }
    };

    /**
     * Everything inside an element that can be tabbed to, in tab order.
     *
     * @param root Where to look. The whole document body when omitted.
     * @returns The focusable elements in document order, which is tab order as long as nothing carries
     * a positive `tabindex`. Elements that match the markup but cannot actually be reached — hidden,
     * `inert`, inside an `aria-hidden` subtree — are left out.
     */
    export const getFocusableChildren = (root?: HTMLElement): HTMLElement[] =>
        Array.from((root ?? document.body).querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isReachable);

    /**
     * The first thing inside an element that can be tabbed to.
     *
     * @param root Where to look. The whole document body when omitted.
     * @returns The element, or `null` when there is nothing focusable inside.
     */
    export const getFirstFocusableChild = (root?: HTMLElement): HTMLElement | null =>
        getFocusableChildren(root)[0] ?? null;

    /**
     * The last thing inside an element that can be tabbed to.
     *
     * @param root Where to look. The whole document body when omitted.
     * @returns The element, or `null` when there is nothing focusable inside.
     */
    export const getLastFocusableChild = (root?: HTMLElement): HTMLElement | null => {
        const focusableChildren = getFocusableChildren(root);

        return focusableChildren.at(-1) ?? null;
    };

    /**
     * Wraps Tab around inside an element, so focus cannot leave it.
     *
     * Only the two ends are intercepted; everywhere else Tab is left alone, so the browser's own
     * ordering is what moves focus through the layer. Attach this to a `keydown` handler on the layer's
     * root.
     *
     * @param e The keyboard event. Keys other than Tab are ignored.
     * @param ref The element to trap within. Nothing is trapped when it has nothing focusable inside,
     * which lets an empty layer still be escaped from.
     */
    export const focusTrapKeyDown = (
        e: KeyboardEvent & {
            currentTarget: HTMLDivElement;
            target: Element;
        },
        ref: HTMLElement | undefined,
    ) => {
        if (e.key !== "Tab") return;

        const children = FocusManagerUtils.getFocusableChildren(ref);
        const first = children[0];
        const last = children.at(-1);

        if (!first || !last) return;

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    };

    /**
     * Moves focus into an element when it appears, and back where it came from when it goes.
     *
     * Focusing is done with scrolling suppressed, so opening a layer does not jerk the page underneath
     * it. On the way out, focus is only restored if the element that had it is still in the document —
     * a trigger that has itself been removed cannot be returned to — and the restore is marked so that
     * other layers' focus handlers do not read it as the user leaving.
     *
     * @param getRef The element to focus into.
     * @param getIsVisible Whether it is currently shown.
     * @param opts.getInitialRef What to focus instead of the first focusable child — a text field
     * rather than a close button, say. Read once, when focus moves in, so a later change does not steal
     * focus from the user.
     */
    export const autoFocus = (
        getRef: () => HTMLElement | undefined,
        getIsVisible: () => boolean,
        opts?: { getInitialRef?: () => HTMLElement | undefined },
    ) =>
        createEffect(() => {
            const ref = getRef();
            const isVisible = getIsVisible();

            if (!ref || !isVisible) return;

            const previouslyFocused = (document.activeElement as HTMLElement | null) ?? undefined;
            const initialRef = untrack(() => opts?.getInitialRef?.());

            (initialRef ?? getFirstFocusableChild(ref))?.focus({ preventScroll: true });

            onCleanup(() => {
                if (!previouslyFocused?.isConnected) return;

                runFocusRestore(() => {
                    previouslyFocused.focus({ preventScroll: true });
                });
            });
        });
}
