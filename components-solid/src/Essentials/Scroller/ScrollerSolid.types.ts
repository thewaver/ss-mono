import type { Accessor, JSX, ParentProps } from "solid-js";

import type { BaseScrollerValues, ScrollerStep, ScrollerStepper } from "@thewaver/ss-components";

import type { AccessorValues, SignalSource } from "../../Utils/typeUtils";

export type ScrollerProps = ParentProps<
    AccessorValues<BaseScrollerValues> & {
        /** How far through its run the strip is scrolled. It is the only thing that scrolls it. */
        progress?: SignalSource<number>;
        /** Draws one scroll control, and is handed a stepper for holding it down to keep scrolling. */
        renderButton: (getStep: Accessor<ScrollerStep>, stepper: ScrollerStepper) => JSX.Element;
    }
>;
