import type {
    TooltipArrow,
    TooltipReveal,
} from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";
import type { TooltipBodyStyle } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.types";
import type { ShapeArrowAim, ShapeGeometry, Size2d } from "@thewaver/ss-utils";

export type TooltipContentProps = {
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    reveal?: TooltipReveal;
    arrow?: TooltipArrow;
    arrowWidth?: number;
    arrowLength?: number;
    arrowAim?: ShapeArrowAim;
    isWide?: boolean;
};

export type TooltipSurfaceProps = {
    hasArrow?: boolean;
    computeGeometry: (size: Size2d, bodyStyle: TooltipBodyStyle | undefined) => ShapeGeometry;
};
