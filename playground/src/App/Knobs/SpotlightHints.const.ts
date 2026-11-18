export namespace SpotlightHintKnobs {
    export const PADDING_TEXT = {
        label: "Padding (px)",
        hint: "How much room is left around the lit element, so the hole is not cut tight against it.",
        controls: "Sets SpotlightHintProps.padding",
    };

    export const TRANSITION_DURATION_MS_TEXT = {
        label: "Transition duration (ms)",
        hint: "How long the hint takes to fade in and out. At 0 it appears and goes at once.",
        controls: "Sets SpotlightHintProps.transitionDurationMs",
    };
}
