export namespace TrailKnobs {
    export const MIN_DURATION_MS = 500;
    export const MAX_DURATION_MS = 20000;
    export const DURATION_STEP_MS = 500;

    export const STARTING_IS_LOOPING = true;
    export const STARTING_IS_TURNING = true;

    export const DURATION_MS_TEXT = {
        label: "Lap duration (ms)",
        hint: "How long the traveler takes to walk the path once, end to end.",
        controls: "Sets TrailProps.durationMs",
    };

    export const IS_LOOPING_TEXT = {
        label: "Loops",
        hint: "Sends the traveler round again as soon as it reaches the end, instead of stopping there.",
        controls: "Sets TrailProps.isLooping",
    };

    export const IS_TURNING_TEXT = {
        label: "Faces along the path",
        hint: "Turns the traveler to point the way it is going, instead of leaving it upright the whole way round.",
        controls: "Sets TrailProps.isTurning",
    };
}
