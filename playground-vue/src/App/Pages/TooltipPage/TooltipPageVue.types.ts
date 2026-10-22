import type { Ref } from "vue";

import type { ArrowBedShape } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
import type { BaseTooltipExampleProps } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.types";
import type { TooltipArrow } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";
import type { ShapeArrowAim, Size2d } from "@thewaver/ss-utils";

export type TooltipExampleProps = BaseTooltipExampleProps;

export type TooltipCirclingExampleProps = {
    "degrees": number;
    "onUpdate:degrees"?: (degrees: number) => void;
};

export type ArrowBedArrow = Exclude<TooltipArrow, "none">;

export type ArrowBedControls = {
    arrow: Ref<ArrowBedArrow>;
    arrowWidth: Ref<number>;
    arrowLength: Ref<number>;
    shape: Ref<ArrowBedShape>;
};

export type ArrowBedKnobsProps = {
    controls: ArrowBedControls;
};

export type ArrowBedTooltipProps = {
    controls: ArrowBedControls;
    computeAim: (size: Size2d) => ShapeArrowAim | undefined;
    label: string;
};
