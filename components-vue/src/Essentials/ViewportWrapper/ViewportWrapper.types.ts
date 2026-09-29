import type { VNodeChild } from "vue";

import type { Size2d } from "@thewaver/ss-utils";

export type ViewportWrapperProps = {
    /**
     * The size everything inside is laid out against. The contents are scaled to the real window from it, so a layout
     * can be written once at one size.
     */
    size: Size2d;
};

export type ViewportWrapperSlots = {
    /** What is laid out inside the viewport, at its design size. */
    default?: () => VNodeChild;
};
