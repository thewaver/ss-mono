import type { ReactNode } from "react";

import type { ScrollerButtonPlacement, ScrollerStep, ScrollerStepper } from "@thewaver/ss-components";

export type ScrollerProps = {
    /** The space between items. */
    gap?: number;
    /** How much room is left at the ends of the run, so the first and last items are not flush against the edge. */
    padding?: number;
    /** Where the scroll controls sit. */
    buttonPlacement?: ScrollerButtonPlacement;
    /**
     * How far through its run the strip is scrolled, with its setter. It is the only thing that scrolls it: the strip
     * writes its position through the setter as it moves, and a value written from outside scrolls it there.
     */
    progressState?: readonly [number, (ratio: number) => void];
    /** Draws one scroll control, and is handed a stepper for holding it down to keep scrolling. */
    renderButton: (step: ScrollerStep, stepper: ScrollerStepper) => ReactNode;
    /** The run of items the strip scrolls. They are rendered as they are, inside the track. */
    children?: ReactNode;
};
