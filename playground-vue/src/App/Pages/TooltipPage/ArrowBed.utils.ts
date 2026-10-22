import { shallowRef } from "vue";

import { TooltipKnobs } from "@thewaver/ss-playground/App/Knobs/Tooltips.const";
import type { ArrowBedShape } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";

import type { ArrowBedArrow, ArrowBedControls } from "./TooltipPageVue.types";

export const useArrowBed = (): ArrowBedControls => {
    const arrow = shallowRef<ArrowBedArrow>(TooltipKnobs.STARTING_ARROW_BED_ARROW);
    const arrowWidth = shallowRef(TooltipKnobs.STARTING_ARROW_WIDTH);
    const arrowLength = shallowRef(TooltipKnobs.STARTING_ARROW_LENGTH);
    const shape = shallowRef<ArrowBedShape>(TooltipKnobs.STARTING_ARROW_BED_SHAPE);

    return { arrow, arrowWidth, arrowLength, shape };
};
