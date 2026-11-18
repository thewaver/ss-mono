export namespace FlyoutMenuKnobs {
    export const MIN_DELAY_MS = 0;
    export const MAX_DELAY_MS = 1000;
    export const DELAY_STEP_MS = 50;
    export const MIN_TRANSITION_MS = 0;
    export const MAX_TRANSITION_MS = 1000;
    export const TRANSITION_STEP_MS = 50;

    export const HOVER_SHOW_DELAY_MS_TEXT = {
        label: "Hover delay (ms)",
        hint: "How long the pointer has to rest on an entry before its panel opens.",
        controls: "Sets FlyoutMenuProps.hoverShowDelayMs",
    };

    export const TRANSITION_DURATION_MS_TEXT = {
        label: "Transition duration (ms)",
        hint: "How long the panel takes to fade, and to glide from one entry to the next.",
        controls: "Sets FlyoutMenuProps.transitionDurationMs",
    };
}
