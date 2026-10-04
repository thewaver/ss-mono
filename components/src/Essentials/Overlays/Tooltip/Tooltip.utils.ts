/** The attribute a tooltip is announced through. */
const ARIA_DESCRIBED_BY_ATTRIBUTE = "aria-describedby";

/** Splits an id list attribute into its ids. */
const readIds = (value: string | null) => (value ? value.split(/\s+/).filter(Boolean) : []);

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
}
