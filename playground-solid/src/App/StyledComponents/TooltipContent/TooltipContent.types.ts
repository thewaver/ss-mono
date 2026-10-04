import type { AccessorProps } from "@thewaver/ss-components-solid";
import type { TooltipReveal } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

export type TooltipContentProps = AccessorProps<{
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    reveal?: TooltipReveal;
}>;
