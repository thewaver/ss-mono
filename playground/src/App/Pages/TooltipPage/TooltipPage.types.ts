import type { AnchorPlacement } from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

import type { TooltipArrow, TooltipReveal } from "../../StyledComponents/TooltipContent/TooltipContent.const";
import type { ArrowBedArrow, ArrowBedShape } from "./TooltipPage.const";

export type BaseTooltipBasicDocsExampleValues = {
    placement: AnchorPlacement;
    offset: Point2d;
    transitionDurationMs: number;
    focusShowDelayMs: number;
    hoverShowDelayMs: number;
    reveal: TooltipReveal;
    arrow: TooltipArrow;
    arrowWidth: number;
    arrowLength: number;
};

export type BaseArrowBedValues = {
    arrow: ArrowBedArrow;
    arrowWidth: number;
    arrowLength: number;
    shape: ArrowBedShape;
};
