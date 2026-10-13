import type { VNodeChild } from "vue";

import type { BaseEdgeFaderProps } from "@thewaver/ss-components";

export type EdgeFaderProps = BaseEdgeFaderProps;

export type EdgeFaderSlots = {
    /** The content that scrolls inside the box and is faded at its edges. */
    default?: () => VNodeChild;
};
