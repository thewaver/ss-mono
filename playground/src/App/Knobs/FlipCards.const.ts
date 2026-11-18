export namespace FlipCardKnobs {
    export const MIN_DURATION_MS = 0;
    export const MAX_DURATION_MS = 3000;
    export const DURATION_STEP_MS = 100;

    export const AXIS_TEXT = {
        label: "Axis",
        hint: "Which way the card turns over to show its other side.",
        controls: "Sets FlipCardProps.axis",
    };

    export const TRANSITION_DURATION_MS_TEXT = {
        label: "Turn duration (ms)",
        hint: "How long one turn from face to face takes.",
        controls: "Sets FlipCardProps.transitionDurationMs",
    };
}
