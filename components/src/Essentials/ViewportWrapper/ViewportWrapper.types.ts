import type { Size2d } from "@thewaver/ss-utils";

export type ViewportWrapperFit = {
    scale: number;
    scaleRect: DOMRect;
};

export type BaseViewportWrapperValues = {
    /**
     * The size everything inside is laid out against. The contents are scaled to the real window from it, so a layout
     * can be written once at one size.
     */
    size: Size2d;
};

export type BaseViewportWrapperProps = BaseViewportWrapperValues;
