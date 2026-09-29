import type { VNodeChild } from "vue";

import type { ScrollerButtonPlacement, ScrollerStep, ScrollerStepper } from "@thewaver/ss-components";

export type ScrollerProps = {
    /** The space between items. */
    "gap"?: number;
    /** How much room is left at the ends of the run, so the first and last items are not flush against the edge. */
    "padding"?: number;
    /** Where the scroll controls sit. */
    "buttonPlacement"?: ScrollerButtonPlacement;
    /**
     * How far through its run the strip is scrolled. It is the only thing that scrolls it: the strip writes its
     * position back as it moves, and a value written from outside scrolls it there.
     */
    "progress"?: number;
    /** Receives the strip's position as it moves, which is what `v-model:progress` binds. */
    "onUpdate:progress"?: (ratio: number) => void;
};

export type ScrollerSlots = {
    /** Draws one scroll control, and is handed a stepper for holding it down to keep scrolling. */
    renderButton: (props: { step: ScrollerStep; stepper: ScrollerStepper }) => VNodeChild;
    /** The run of items the strip scrolls. They are rendered as they are, inside the track. */
    default?: () => VNodeChild;
};
