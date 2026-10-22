import type { ArrowBedShape } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
import type { BaseTooltipExampleProps } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.types";
import type { TooltipArrow } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

export type TooltipExampleProps = BaseTooltipExampleProps;

export type ArrowBedControls = {
    arrow: Exclude<TooltipArrow, "none">;
    arrowWidth: number;
    arrowLength: number;
    shape: ArrowBedShape;
};
