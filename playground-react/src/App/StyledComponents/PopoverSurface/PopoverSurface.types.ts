import type { AnchorPlacement } from "@thewaver/ss-components-react";

export type PopoverSurfaceProps = {
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    placement: AnchorPlacement;
};
