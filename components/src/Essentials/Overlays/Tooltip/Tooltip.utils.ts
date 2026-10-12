/** The attribute a tooltip is announced through. */
const ARIA_DESCRIBED_BY_ATTRIBUTE = "aria-describedby";

/** The selector a tooltip's own element answers to. */
const TOOLTIP_SELECTOR = '[role="tooltip"]';

/** Splits an id list attribute into its ids. */
const readIds = (value: string | null) => (value ? value.split(/\s+/).filter(Boolean) : []);

/** Whether `target` is a node inside `element`. */
const getIsInside = (element: Element, target: EventTarget | null) =>
    target instanceof Node && element.contains(target);

/** The part of a tooltip that is not about where it is drawn: how its anchor comes to announce it. */
export namespace TooltipUtils {
    /**
     * The `transition` a showing tooltip moves with when it is handed a different anchor.
     *
     * The move takes the tooltip's own fade duration, so a tooltip shared along a row of controls glides from one
     * to the next rather than jumping. Only the move is eased; anything else that moves it — a scroll, a resize —
     * takes it straight there.
     *
     * @param durationMs The tooltip's `transitionDurationMs`.
     */
    export const getGlideTransition = (durationMs: number) => `transform ${durationMs}ms ease`;

    /**
     * Adds a tooltip to what its anchor is described by, until the returned function is called.
     *
     * The tooltip's id joins the anchor's `aria-describedby` alongside whatever ids are already there, and leaves
     * again without disturbing them — including ids another tooltip or the consumer added in the meantime. The
     * attribute is removed outright once nothing is left in it. Adding an id that is already there adds nothing.
     *
     * @param anchor The element the tooltip describes.
     * @param tooltipId The tooltip's own id.
     * @returns The function that takes the id back out.
     */
    export const describe = (anchor: HTMLElement, tooltipId: string) => {
        const ids = readIds(anchor.getAttribute(ARIA_DESCRIBED_BY_ATTRIBUTE));

        if (!ids.includes(tooltipId)) anchor.setAttribute(ARIA_DESCRIBED_BY_ATTRIBUTE, [...ids, tooltipId].join(" "));

        return () => {
            const remaining = readIds(anchor.getAttribute(ARIA_DESCRIBED_BY_ATTRIBUTE)).filter(
                (id) => id !== tooltipId,
            );

            if (remaining.length) {
                anchor.setAttribute(ARIA_DESCRIBED_BY_ATTRIBUTE, remaining.join(" "));
            } else {
                anchor.removeAttribute(ARIA_DESCRIBED_BY_ATTRIBUTE);
            }
        };
    };

    /**
     * The tooltip describing `anchor` that `target` sits in, if there is one.
     *
     * A control that tracks which of its items the pointer is over loses the pointer the moment it crosses onto an
     * item's tooltip, because the tooltip is drawn outside the control. This tells that crossing apart from the
     * pointer leaving for anywhere else: the tooltip counts only while the anchor is described by it, which is only
     * while it is showing for that anchor — see {@link describe}.
     *
     * @param anchor The item the pointer was over, or `undefined` when it was over none.
     * @param target Where the pointer went, as a leave event's `relatedTarget`.
     * @returns The tooltip's element, or `undefined` when the pointer went anywhere else.
     */
    export const findDescribingTooltip = (anchor: Element | undefined, target: EventTarget | null) => {
        if (!anchor || !(target instanceof Element)) return undefined;

        const tooltip = target.closest(TOOLTIP_SELECTOR);

        if (!(tooltip instanceof HTMLElement) || !tooltip.id) return undefined;

        return readIds(anchor.getAttribute(ARIA_DESCRIBED_BY_ATTRIBUTE)).includes(tooltip.id) ? tooltip : undefined;
    };

    /**
     * Waits for the pointer to move off a tooltip it was carried onto from inside a control.
     *
     * The partner of {@link findDescribingTooltip}: once the pointer is on an item's tooltip the control keeps the item
     * counted as hovered, and this says when to stop. The first time the pointer arrives anywhere outside the tooltip,
     * `onExit` is called once, told whether that place is back inside the control — in which case the control's own
     * hover tracking has already taken over and there is nothing to clear. A tooltip closed under a resting pointer is
     * noticed on the pointer's next move.
     *
     * @param tooltip The tooltip the pointer is on.
     * @param root The control the pointer came from.
     * @param onExit Called once the pointer is off the tooltip, with whether it landed back inside `root`.
     * @returns The function that stops waiting. Calling it after `onExit` has run is harmless.
     */
    export const observePointerExit = (
        tooltip: HTMLElement,
        root: HTMLElement,
        onExit: (isBackInRoot: boolean) => void,
    ) => {
        const ownerDocument = tooltip.ownerDocument;

        const stop = () => ownerDocument.removeEventListener("pointerover", handlePointerOver);

        const handlePointerOver = (e: PointerEvent) => {
            if (getIsInside(tooltip, e.target)) return;

            stop();
            onExit(getIsInside(root, e.target));
        };

        ownerDocument.addEventListener("pointerover", handlePointerOver);

        return stop;
    };
}
