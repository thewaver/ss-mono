import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components";

import type { SatelliteBadgeCorner } from "../Pages/SatellitePage/SatelliteBadgeCorner.types";

export namespace SatelliteKnobs {
    export const BADGE_CORNERS: SatelliteBadgeCorner[] = ["top_right", "top_left", "bottom_right", "bottom_left"];

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
    export const MAX_OVERHANG = 32;
    export const OVERHANG_STEP = 1;

    export const STARTING_H_PLACEMENT: AnchorHPlacement = "right_out";
    export const STARTING_V_PLACEMENT: AnchorVPlacement = "top_out";
    export const STARTING_SUBJECT_WIDTH = 240;
    export const STARTING_SUBJECT_HEIGHT = 160;
    export const STARTING_BADGE_SIZE = 48;
    export const STARTING_HAS_SATELLITE = true;
    export const STARTING_CORNER: SatelliteBadgeCorner = "top_right";
    export const STARTING_COUNT = 7;
    export const STARTING_OVERHANG = 16;

    export const H_PLACEMENT_TEXT = {
        label: "Placement across",
        hint: "Where the satellite sits across its subject: inside an edge, centered, or outside it altogether.",
        controls: "Sets SatelliteDefs.placement.x",
    };

    export const V_PLACEMENT_TEXT = {
        label: "Placement down",
        hint: "Where the satellite sits above or below its subject: inside an edge, centered, or outside it altogether.",
        controls: "Sets SatelliteDefs.placement.y",
    };

    export const OFFSET_X_TEXT = {
        label: "Offset across (px)",
        hint: "How far the satellite is nudged sideways from where the placement put it.",
        controls: "Sets SatelliteDefs.offset.x",
    };

    export const OFFSET_Y_TEXT = {
        label: "Offset down (px)",
        hint: "How far the satellite is nudged up or down from where the placement put it.",
        controls: "Sets SatelliteDefs.offset.y",
    };

    export const HAS_SATELLITE_TEXT = {
        label: "Render a satellite",
        hint: "Whether a satellite is rendered at all, so the subject can be seen with and without one.",
        controls: "Switches SatelliteProps.satellites between one satellite and none",
    };

    export const BADGE_SIZE_TEXT = {
        label: "Satellite size (px)",
        hint: "How large the satellite itself is.",
        controls: "Sets the size of the example badge drawn by SatelliteDefs.renderSatellite",
    };

    export const IS_BEHIND_SUBJECT_TEXT = {
        label: "Behind the subject",
        hint: "Puts the satellite under the subject rather than over it, so the subject hides whatever overlaps.",
        controls: "Sets SatelliteDefs.isBehindSubject",
    };

    export const BADGE_CORNER_TEXT = {
        label: "Corner",
        hint: "Which corner the badge is pinned to; the overhang turns outward with it.",
        controls: "Picks the corner the example turns into SatelliteDefs.placement and SatelliteDefs.offset",
    };

    export const BADGE_COUNT_TEXT = {
        label: "Count",
        hint: "The number on the badge. More digits make it wider, and it grows toward the middle.",
        controls: "Sets the number in the example pill drawn by SatelliteDefs.renderSatellite",
    };

    export const BADGE_OVERHANG_TEXT = {
        label: "Overhang (px)",
        hint: "How far the badge pokes out past each of the two edges it is pinned to.",
        controls: "Sets how far the example pushes SatelliteDefs.offset out from the corner",
    };
}
