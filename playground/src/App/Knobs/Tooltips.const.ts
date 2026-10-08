import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components";

import type { TooltipArrow, TooltipReveal } from "../StyledComponents/TooltipContent/TooltipContent.const";

export namespace TooltipKnobs {
    export const MIN_OFFSET = -40;
    export const MAX_OFFSET = 40;
    export const OFFSET_STEP = 5;
    export const MIN_DURATION = 0;
    export const MAX_DURATION = 1000;
    export const DURATION_STEP = 50;

    export const STARTING_H_PLACEMENT: AnchorHPlacement = "center";
    export const STARTING_V_PLACEMENT: AnchorVPlacement = "top-out";
    export const STARTING_OFFSET_Y = 10;
    export const STARTING_OFFSET_X = 0;
    export const STARTING_REVEAL: TooltipReveal = "fade";
    export const STARTING_ARROW: TooltipArrow = "none";
    export const MIN_ARROW_SIZE = 1;
    export const MAX_ARROW_SIZE = 40;
    export const ARROW_SIZE_STEP = 1;
    export const STARTING_ARROW_WIDTH = 14;
    export const STARTING_ARROW_LENGTH = 9;
}
