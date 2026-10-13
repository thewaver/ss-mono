import type { AnchorPlacement } from "@thewaver/ss-components";

export type BasePopoverSurfaceValues = {
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    placement: AnchorPlacement;
};

export type BasePopoverSurfaceProps = BasePopoverSurfaceValues;
