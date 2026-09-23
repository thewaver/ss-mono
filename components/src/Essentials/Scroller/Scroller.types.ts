import type { Accessor, JSX, ParentProps } from "solid-js";

import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

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

export type ScrollerProps = ParentProps<
    AccessorProps<{
        /** The space between items. */
        gap?: number;
        /** How much room is left at the ends of the run, so the first and last items are not flush against the edge. */
        padding?: number;
        /** Where the scroll controls sit. */
        buttonPlacement?: ScrollerButtonPlacement;
    }> & {
        /** How far through its run the strip is scrolled. It is the only thing that scrolls it. */
        progressSignal?: SignalSource<number>;
        /** Draws one scroll control, and is handed a stepper for holding it down to keep scrolling. */
        renderButton: (getStep: Accessor<ScrollerStep>, stepper: ScrollerStepper) => JSX.Element;
    }
>;
