export namespace WraparoundKnobs {
    export const MIN_DRIFT_PX_PER_SECOND = 10;
    export const MAX_DRIFT_PX_PER_SECOND = 400;
    export const DRIFT_STEP_PX_PER_SECOND = 10;

    export const MIN_DRIFT_DEGREES = 0;
    export const MAX_DRIFT_DEGREES = 345;
    export const DRIFT_STEP_DEGREES = 15;

    export const STARTING_DRIFT_PX_PER_SECOND = 60;

    export const DRIFT_PX_PER_SECOND_TEXT = {
        label: "Marquee speed (px/s)",
        hint: "How far the marquee's strip drifts in a second. It is off while the visitor has asked for reduced motion.",
        controls: "Sets WraparoundProps.driftPxPerSecond",
    };

    export const DRIFT_DEGREES_TEXT = {
        label: "Marquee direction (°)",
        hint: "Which way the marquee's strip drifts: 0 is to the right, 90 down, 180 to the left and 270 up.",
        controls: "Sets WraparoundProps.driftDegrees",
    };
}
