import type { AnchorPlacement } from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

import type { TooltipArrow, TooltipReveal } from "../../StyledComponents/TooltipContent/TooltipContent.const";

export type BaseTooltipExampleValues = {
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

export type BaseTooltipExampleProps = BaseTooltipExampleValues;
