import type { AnchorPlacement } from "@thewaver/ss-components-vue";

export type PopoverSurfaceProps = {
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    placement: AnchorPlacement;
};
