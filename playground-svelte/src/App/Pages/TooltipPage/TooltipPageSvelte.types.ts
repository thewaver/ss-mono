import type { ArrowBedArrow, ArrowBedShape } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
import type {
    BaseArrowBedValues,
    BaseTooltipBasicDocsExampleValues,
} from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.types";
import type { ShapeArrowAim, Size2d } from "@thewaver/ss-utils";

export type TooltipBasicDocsExampleProps = BaseTooltipBasicDocsExampleValues;

export type ArrowBedDocsExampleProps = BaseArrowBedValues;

export type ArrowBedControls = {
    arrow: ArrowBedArrow;
    arrowWidth: number;
    arrowLength: number;
    shape: ArrowBedShape;
};

export type ArrowBedKnobsProps = {
    keyPrefix: string;
    arrowBed: ArrowBedControls;
};

export type ArrowBedTooltipProps = ArrowBedDocsExampleProps & {
    computeAim: (size: Size2d) => ShapeArrowAim | undefined;
    label: string;
};
