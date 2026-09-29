import type { VNodeChild } from "vue";

import type { LabelOrientation } from "@thewaver/ss-components";

export type LabelProps = {
    /** Whether the caption sits beside the control or above it. */
    orientation?: LabelOrientation;
    /** The space between the caption and the control. */
    gap?: number;
};

export type LabelSlots = {
    /** The caption and the control it names. */
    default?: () => VNodeChild;
};
