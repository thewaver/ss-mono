import type {
    TooltipArrow,
    TooltipReveal,
} from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";
import type { ShapeArrowAim } from "@thewaver/ss-utils";

export type TooltipContentProps = {
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    reveal?: TooltipReveal;
    arrow?: TooltipArrow;
    arrowWidth?: number;
    arrowLength?: number;
    arrowAim?: ShapeArrowAim;
};
