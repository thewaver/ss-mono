import type { Ref } from "vue";

import type { ArrowBedArrow, ArrowBedShape } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
import type {
    BaseArrowBedValues,
    BaseTooltipBasicDocsExampleValues,
} from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.types";
import type { ShapeArrowAim, Size2d } from "@thewaver/ss-utils";

export type TooltipBasicDocsExampleProps = BaseTooltipBasicDocsExampleValues;

export type ArrowBedDocsExampleProps = BaseArrowBedValues;

export type ArrowBedControls = {
    arrow: Ref<ArrowBedArrow>;
    arrowWidth: Ref<number>;
    arrowLength: Ref<number>;
    shape: Ref<ArrowBedShape>;
};

export type ArrowBedKnobsProps = {
    keyPrefix: string;
    controls: ArrowBedControls;
};

export type ArrowBedTooltipProps = ArrowBedDocsExampleProps & {
    computeAim: (size: Size2d) => ShapeArrowAim | undefined;
    label: string;
};
