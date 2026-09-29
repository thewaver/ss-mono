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
