export type AccordionSizing = "fit-content" | "fill";

export type AccordionOrientation = "horizontal" | "vertical";

export type AccordionMoveDirection = "backward" | "forward";

export type AccordionItem<T> = {
    value: T;
    isDisabled?: boolean;
    /**
     * Keeps this section's header in the tab order and the arrow-key walk while it is disabled, so focus can land on it
     * and a reader hears its name and that it is unavailable. It still cannot be opened or closed.
     */
    isReachableWhenDisabled?: boolean;
    /**
     * How wide this section is while open in a row, header strip included, as a share of the accordion's own width.
     * It is a share rather than pixels so it still holds when the window is resized. A section without one fills
     * what the closed strips and the other open sections leave. It needs the row to have a width of its own, so it is
     * read only under `orientation: "horizontal"` with `sizing: "fill"`; otherwise a panel is as wide as its content.
     */
    openWidthShare?: number;
};

export type AccordionWidthOpts = {
    /** The accordion's own width, in pixels. */
    rowWidth: number;
    /** Each section's header strip width, in pixels, in list order. */
    stripWidths: readonly number[];
    /** The space between two sections, in pixels. */
    gap: number;
};
