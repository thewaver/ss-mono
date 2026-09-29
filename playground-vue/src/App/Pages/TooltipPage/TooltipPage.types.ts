import type { AnchorPlacement } from "@thewaver/ss-components-vue";
import type { Point2d } from "@thewaver/ss-utils";

export type TooltipExampleProps = {
    placement: AnchorPlacement;
    offset: Point2d;
    transitionDurationMs: number;
    focusShowDelayMs: number;
    hoverShowDelayMs: number;
    skipDelayWindowMs: number;
};
