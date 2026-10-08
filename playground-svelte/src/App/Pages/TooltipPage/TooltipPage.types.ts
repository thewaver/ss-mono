import type { AnchorPlacement } from "@thewaver/ss-components-svelte";
import type {
    TooltipArrow,
    TooltipReveal,
} from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";
import type { Point2d } from "@thewaver/ss-utils";

export type TooltipExampleProps = {
    placement: AnchorPlacement;
    offset: Point2d;
    transitionDurationMs: number;
    focusShowDelayMs: number;
    hoverShowDelayMs: number;
    skipDelayWindowMs: number;
    reveal: TooltipReveal;
    arrow: TooltipArrow;
    arrowWidth: number;
    arrowLength: number;
};
