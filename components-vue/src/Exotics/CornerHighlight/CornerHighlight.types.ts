import type { VNodeChild } from "vue";

import type { BaseCornerHighlightProps } from "@thewaver/ss-components";

export type CornerHighlightProps = BaseCornerHighlightProps;

export type CornerHighlightSlots = {
    /** What the corners frame. */
    default?: () => VNodeChild;
};
