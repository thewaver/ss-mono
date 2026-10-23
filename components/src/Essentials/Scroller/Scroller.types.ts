export type ScrollerStep = "previous" | "next";

export type ScrollerButtonPlacement = "split" | "start" | "end";

export type ScrollerStepper = {
    /** Whether the run is scrolled all the way to its start. */
    getIsAtStart: () => boolean;
    /** Whether the run is scrolled all the way to its end. */
    getIsAtEnd: () => boolean;
    /** Scrolls back by about one view. Answers `false` when the run is already at its start. */
    stepToPrevious: () => boolean;
    /** Scrolls on by about one view. Answers `false` when the run is already at its end. */
    stepToNext: () => boolean;
};

export type ScrollerMetrics = {
    start: number;
    visible: number;
    total: number;
};

export type BaseScrollerValues = {
    /** The space between items. */
    gap?: number;
    /** How much room is left at the ends of the run, so the first and last items are not flush against the edge. */
    padding?: number;
    /**
     * How many of the items fully in view stay in view after a step, so a reader keeps something to tie the new view
     * to. The default is none: a step moves on by as much as fits, and only the item cut off at the edge is carried
     * over. A whole number from `0`; a fraction is rounded down, and a step always moves by at least one item,
     * however large this is, so it can never leave a press doing nothing.
     */
    overlapCount?: number;
    /** Where the scroll controls sit. */
    buttonPlacement?: ScrollerButtonPlacement;
};

export type BaseScrollerProps = BaseScrollerValues;
