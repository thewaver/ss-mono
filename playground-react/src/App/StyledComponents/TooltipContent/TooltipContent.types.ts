import type { TooltipReveal } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

export type TooltipContentProps = {
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    reveal?: TooltipReveal;
};
