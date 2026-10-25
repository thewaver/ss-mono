import { TooltipKnobs } from "@thewaver/ss-playground/App/Knobs/Tooltips.const";
import type { ArrowBedArrow, ArrowBedShape } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";

import type { ArrowBedControls } from "./TooltipPageSvelte.types";

export const createArrowBed = (): ArrowBedControls => {
    let arrow = $state<ArrowBedArrow>(TooltipKnobs.STARTING_ARROW_BED_ARROW);
    let arrowWidth = $state(TooltipKnobs.STARTING_ARROW_WIDTH);
    let arrowLength = $state(TooltipKnobs.STARTING_ARROW_LENGTH);
    let shape = $state<ArrowBedShape>(TooltipKnobs.STARTING_ARROW_BED_SHAPE);

    return {
        get arrow() {
            return arrow;
        },
        set arrow(value) {
            arrow = value;
        },
        get arrowWidth() {
            return arrowWidth;
        },
        set arrowWidth(value) {
            arrowWidth = value;
        },
        get arrowLength() {
            return arrowLength;
        },
        set arrowLength(value) {
            arrowLength = value;
        },
        get shape() {
            return shape;
        },
        set shape(value) {
            shape = value;
        },
    };
};
