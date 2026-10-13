import type { VNodeChild } from "vue";

import type { BaseLabelProps } from "@thewaver/ss-components";

export type LabelProps = BaseLabelProps;

export type LabelSlots = {
    /** The caption and the control it names. */
    default?: () => VNodeChild;
};
