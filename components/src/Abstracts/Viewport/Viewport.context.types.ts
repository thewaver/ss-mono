import type { Size2d } from "@thewaver/ss-utils";

export type ViewportContextType = {
    getPortalRef: () => HTMLElement | undefined;
    getSize: () => Size2d;
    getScale: () => number;
    getScaledRect: () => DOMRect;
};
