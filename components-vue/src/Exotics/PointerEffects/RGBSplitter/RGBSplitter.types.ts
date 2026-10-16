import type { VNodeChild } from "vue";

import type { BaseRGBSplitterProps } from "@thewaver/ss-components";

export type RGBSplitterProps = BaseRGBSplitterProps;

export type RGBSplitterSlots = {
    /** The content the effect is applied to. */
    default?: () => VNodeChild;
};
