import type { Signal } from "solid-js";

import type { AccessorProps, AccessorValues } from "@thewaver/ss-components-solid";
import type { ArrowBedArrow, ArrowBedShape } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
import type {
    BaseArrowBedValues,
    BaseTooltipBasicDocsExampleValues,
} from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.types";
import type { ShapeArrowAim, Size2d } from "@thewaver/ss-utils";

export type TooltipBasicDocsExampleProps = AccessorValues<BaseTooltipBasicDocsExampleValues>;

export type ArrowBedDocsExampleProps = AccessorValues<BaseArrowBedValues>;

export type ArrowBedTooltipProps = ArrowBedDocsExampleProps &
    AccessorProps<{
        computeAim: (size: Size2d) => ShapeArrowAim | undefined;
        label: string;
    }>;

export type ArrowBedKnobsProps = AccessorProps<{
    keyPrefix: string;
    arrow: Signal<ArrowBedArrow>;
    arrowWidth: Signal<number>;
    arrowLength: Signal<number>;
    shape: Signal<ArrowBedShape>;
}>;
