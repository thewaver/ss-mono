import type { VNodeChild } from "vue";

import type { BaseCornersProps } from "@thewaver/ss-components";

export type CornersProps = BaseCornersProps;

export type CornersSlots = {
    /** What the corners frame. */
    default?: () => VNodeChild;
};
