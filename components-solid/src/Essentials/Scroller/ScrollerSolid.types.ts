import type { Accessor, JSX, ParentProps } from "solid-js";

import type { ScrollerButtonPlacement, ScrollerStep, ScrollerStepper } from "@thewaver/ss-components";

import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

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
        progress?: SignalSource<number>;
        /** Draws one scroll control, and is handed a stepper for holding it down to keep scrolling. */
        renderButton: (getStep: Accessor<ScrollerStep>, stepper: ScrollerStepper) => JSX.Element;
    }
>;
