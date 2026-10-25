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

const getFocusedElement = () => (document.activeElement as HTMLElement | null) ?? undefined;

/** How many focus restores are in flight. A counter rather than a flag, since nested layers can close together. */
let restoreDepth = 0;

/** The attributes whose change can make something inside a subtree focusable or stop it being so. */
const FOCUS_ATTRIBUTES = ["tabindex", "disabled", "href", "contenteditable", "inert", "hidden", "aria-hidden"];

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
     * Watches whether anything inside an element can be tabbed to.
     *
     * Children arriving or leaving and any change to an attribute that affects focusability, anywhere in the subtree,
     * are heard, so a box that scrolls can tell whether a keyboard user has something inside it to focus. The callback
     * runs once at the start and again on every such change.
     *
     * @param root The element to watch.
     * @param onChange Receives whether anything inside can take focus.
     * @returns A function that stops watching.
     */
    export const observeHasFocusable = (root: HTMLElement, onChange: (hasFocusable: boolean) => void) => {
        const update = () => onChange(getFirstFocusableChild(root) !== null);
        const observer = new MutationObserver(update);

        observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: FOCUS_ATTRIBUTES });
        update();

        return () => observer.disconnect();
    };

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

        const children = getFocusableChildren(ref);
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
     * Makes everything beside a layer inert, so neither focus nor a screen reader can reach the page behind it.
     *
     * Walks from the layer up to `<body>` and marks every sibling along the way, which is what `aria-modal`
     * promises and what a reader that ignores it needs. Live regions are left alone, because an inert region
     * announces nothing and the layer's own announcements go through them. A sibling that was already inert is
     * left as it was, so two layers stacked on one another undo only their own work.
     *
     * @param layer The element to leave reachable, along with everything inside it.
     * @returns A function that lifts the seal, restoring exactly the elements this call marked.
     */
    export const sealAround = (layer: HTMLElement) => {
        const sealed: HTMLElement[] = [];

        let node: HTMLElement | null = layer;

        while (node && node !== document.body) {
            const parent: HTMLElement | null = node.parentElement;

            if (!parent) break;

            for (const child of parent.children) {
                if (
                    child === node ||
                    !(child instanceof HTMLElement) ||
                    child.inert ||
                    child.hasAttribute("aria-live")
                ) {
                    continue;
                }

                child.inert = true;
                sealed.push(child);
            }

            node = parent;
        }

        return () => {
            for (const sibling of sealed) sibling.inert = false;
        };
    };

    /**
     * Stops the document scrolling behind a layer, without the page shifting as its scrollbar disappears.
     *
     * The width the scrollbar took is handed to the root as padding, so the content stays where it was. A layer
     * opened over another finds the lock already in place and leaves it, so the outer one lifts it.
     *
     * @returns A function that restores the root's scrolling exactly as this call found it.
     */
    export const lockScroll = () => {
        const documentRoot = document.documentElement;
        const previousOverflow = documentRoot.style.overflow;
        const previousPaddingRight = documentRoot.style.paddingRight;
        const scrollbarWidth = window.innerWidth - documentRoot.clientWidth;

        documentRoot.style.overflow = "hidden";

        if (scrollbarWidth > 0) documentRoot.style.paddingRight = `${scrollbarWidth}px`;

        return () => {
            documentRoot.style.overflow = previousOverflow;
            documentRoot.style.paddingRight = previousPaddingRight;
        };
    };

    /**
     * The element a layer opening now was opened from: the one holding focus, which {@link focusInto} returns
     * focus to when the layer goes.
     *
     * Read it before focus moves into the layer. With nothing focused — focus on the body, or no active element
     * at all — it answers with the document's root element, so a caller reading something inherited from it,
     * such as the direction text runs in, gets the page's own.
     *
     * @returns The focused element, or `document.documentElement` when nothing is.
     */
    export const getFocusOrigin = (): HTMLElement => {
        const active = document.activeElement;

        return active instanceof HTMLElement && active !== document.body ? active : document.documentElement;
    };

    /**
     * Remembers what a layer was first opened from, for a layer that can be hidden and shown again while it stays
     * open — one covered for a while by another layer, say.
     *
     * Each time such a layer shows again, focus is somewhere new — on whatever the layer above left it — and
     * returning focus there when the layer finally closes would strand the reader away from what they opened it
     * with. Hand {@link focusInto} the origin this answers instead, and forget it once the layer closes.
     *
     * @returns `take`, which answers the element kept, while it is still in the document, and otherwise keeps and
     * answers whatever holds focus now; and `forget`, which drops what is kept, for when the layer closes.
     */
    export const createOriginKeeper = () => {
        let origin: HTMLElement | undefined;

        return {
            take: () => {
                if (!origin?.isConnected) origin = getFocusedElement();

                return origin;
            },
            forget: () => {
                origin = undefined;
            },
        };
    };

    /**
     * Moves focus into an element, and hands back the function that puts it where it came from.
     *
     * Focusing is done with scrolling suppressed, so opening a layer does not jerk the page underneath
     * it. On the way out, focus is only restored if the element that had it is still in the document —
     * a trigger that has itself been removed cannot be returned to — and the restore is marked so that
     * other layers' focus handlers do not read it as the user leaving.
     *
     * @param ref The element to focus into.
     * @param opts.initialRef What to focus instead of the first focusable child — a text field rather than a
     * close button, say.
     * @param opts.origin Where to put focus back, in place of whatever holds it now — for a layer showing again
     * while it stays open, the origin {@link createOriginKeeper} kept from its first showing.
     * @returns The function that restores focus, for when the element goes.
     */
    export const focusInto = (ref: HTMLElement, opts?: { initialRef?: HTMLElement; origin?: HTMLElement }) => {
        const previouslyFocused = opts?.origin ?? getFocusedElement();

        (opts?.initialRef ?? getFirstFocusableChild(ref) ?? ref).focus({ preventScroll: true });

        return () => {
            if (!previouslyFocused?.isConnected) return;

            runFocusRestore(() => {
                previouslyFocused.focus({ preventScroll: true });
            });
        };
    };
}
