import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components";

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
}
