export namespace WheelMenuKnobs {
    export const MIN_SPREAD_DEGREES = 90;
    export const MAX_SPREAD_DEGREES = 360;
    export const SPREAD_STEP_DEGREES = 15;
    export const MIN_HOLE_RADIUS = 16;
    export const MAX_HOLE_RADIUS = 128;
    export const HOLE_RADIUS_STEP = 4;
    export const MIN_BAND_WIDTH = 40;
    export const MAX_BAND_WIDTH = 160;
    export const BAND_WIDTH_STEP = 4;
    export const MIN_WEDGE_GAP_DEGREES = 0;
    export const MAX_WEDGE_GAP_DEGREES = 20;
    export const WEDGE_GAP_STEP_DEGREES = 1;

    export const SPREAD_DEGREES_TEXT = {
        label: "Spread (°)",
        hint: "How much of the circle the wedges are spread over: 360 for a whole wheel, 180 for half of one.",
        controls: "Sets WheelMenuProps.spreadDegrees",
    };

    export const HOLE_RADIUS_TEXT = {
        label: "Hole radius (px)",
        hint: "How much of the middle is left empty, which is where the close control sits.",
        controls: "Sets WheelMenuProps.holeRadius",
    };

    export const BAND_WIDTH_TEXT = {
        label: "Band width (px)",
        hint: "How thick the band of wedges is.",
        controls: "Sets WheelMenuProps.bandWidth",
    };

    export const WEDGE_GAP_DEGREES_TEXT = {
        label: "Wedge gap (°)",
        hint: "The space left between one wedge and the next.",
        controls: "Sets WheelMenuProps.layoutDefs.wedgeGapDegrees",
    };

    export const BANDS_SPREAD_DEGREES_TEXT = {
        label: "Spread (°)",
        hint: "How much of the circle the wedges are spread over. Every band stays inside it.",
        controls: "Sets WheelMenuProps.spreadDegrees",
    };

    export const OPENS_ON_HOLD_TEXT = {
        label: "Opens on hold",
        hint: "Whether holding the button down opens the wheel, so a flick toward a wedge picks it on release.",
        controls: "Sets WheelMenuProps.opensOnHold",
    };
}
