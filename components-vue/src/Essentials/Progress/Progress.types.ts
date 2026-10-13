import type { VNodeChild } from "vue";

import type { BaseProgressProps, ProgressState } from "@thewaver/ss-components";

export type ProgressProps = BaseProgressProps;

export type ProgressSlots = {
    /** Draws the bar, and is told how far along it is. */
    renderContent: (state: ProgressState) => VNodeChild;
};
