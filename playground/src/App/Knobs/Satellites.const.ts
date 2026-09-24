import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components";

import type { SatelliteBadgeCorner } from "../Pages/SatellitePage/SatellitePage.types";

export namespace SatelliteKnobs {
    export const BADGE_CORNERS: SatelliteBadgeCorner[] = ["top-right", "top-left", "bottom-right", "bottom-left"];

    export const MIN_OFFSET = -40;
    export const MAX_OFFSET = 40;
    export const OFFSET_STEP = 2;
    export const MIN_SUBJECT_SIZE = 40;
    export const MAX_SUBJECT_SIZE = 240;
    export const SUBJECT_SIZE_STEP = 10;
    export const MIN_BADGE_SIZE = 12;
    export const MAX_BADGE_SIZE = 96;
    export const BADGE_SIZE_STEP = 4;
    export const MIN_COUNT = 0;
    export const MAX_COUNT = 99999;
    export const COUNT_STEP = 1;
    export const MIN_OVERHANG = 0;
    export const MAX_OVERHANG = 16;
    export const OVERHANG_STEP = 1;

    export const STARTING_H_PLACEMENT: AnchorHPlacement = "right-out";
    export const STARTING_V_PLACEMENT: AnchorVPlacement = "top-out";
    export const STARTING_SUBJECT_WIDTH = 140;
    export const STARTING_SUBJECT_HEIGHT = 80;
    export const STARTING_BADGE_SIZE = 28;
    export const STARTING_HAS_SATELLITE = true;
    export const STARTING_CORNER: SatelliteBadgeCorner = "top-right";
    export const STARTING_COUNT = 7;
    export const STARTING_OVERHANG = 8;
}
