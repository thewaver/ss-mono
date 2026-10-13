import type { VNodeChild } from "vue";

import type { BaseViewportWrapperProps } from "@thewaver/ss-components";

export type ViewportWrapperProps = BaseViewportWrapperProps;

export type ViewportWrapperSlots = {
    /** What is laid out inside the viewport, at its design size. */
    default?: () => VNodeChild;
};
