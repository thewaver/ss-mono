import type { Dispatch, SetStateAction } from "react";

import type { ArrowBedArrow, ArrowBedShape } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
import type {
    BaseArrowBedValues,
    BaseTooltipBasicDocsExampleValues,
} from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.types";
import type { ShapeArrowAim, Size2d } from "@thewaver/ss-utils";

export type TooltipBasicDocsExampleProps = BaseTooltipBasicDocsExampleValues;

export type ArrowBedDocsExampleProps = BaseArrowBedValues;

export type ArrowBedTooltipProps = ArrowBedDocsExampleProps & {
    computeAim: (size: Size2d) => ShapeArrowAim | undefined;
    label: string;
};

export type ArrowBedKnobsProps = {
    keyPrefix: string;
    arrow: [ArrowBedArrow, Dispatch<SetStateAction<ArrowBedArrow>>];
    arrowWidth: [number, Dispatch<SetStateAction<number>>];
    arrowLength: [number, Dispatch<SetStateAction<number>>];
    shape: [ArrowBedShape, Dispatch<SetStateAction<ArrowBedShape>>];
};
