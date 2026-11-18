export namespace SlideButtonKnobs {
    export const MIN_COMPLETION_RATIO = 0.1;
    export const MAX_COMPLETION_RATIO = 1;
    export const COMPLETION_RATIO_STEP = 0.05;
    export const MIN_HOLD_DURATION_MS = 250;
    export const MAX_HOLD_DURATION_MS = 3000;
    export const HOLD_DURATION_STEP_MS = 250;

    export const MODE_TEXT = {
        label: "Mode",
        hint: "Which pointer gestures confirm: sliding the thumb to the end, pressing and holding, or both. A held Enter or Space confirms under every mode.",
        controls: "Sets SlideButtonProps.mode",
    };

    export const COMPLETION_RATIO_TEXT = {
        label: "Completion ratio",
        hint: "How far along the track the thumb has to be when let go for the slide to complete. At 1 it has to reach the end; short of it, it springs back.",
        controls: "Sets SlideButtonProps.completionRatio",
    };

    export const HOLD_DURATION_MS_TEXT = {
        label: "Hold duration",
        hint: "How long the button has to be held to confirm without sliding, in milliseconds. It times a held Enter or Space under every mode, and a held pointer under all but slide.",
        controls: "Sets SlideButtonProps.holdDurationMs",
    };

    export const HAS_ERROR_TEXT = {
        label: "Error",
        hint: "Puts the button in its error look. It changes nothing about what the button accepts or does.",
        controls: "Sets SlideButtonProps.hasError",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the button off: it refuses the drag and the hold, and the Tab key skips it.",
        controls: "Sets SlideButtonProps.isDisabled",
    };

    export const ORIENTATION_TEXT = {
        label: "Orientation",
        hint: "Whether the track runs across the page or up it.",
        controls: "Sets SlideButtonProps.orientation",
    };

    export const DIRECTION_TEXT = {
        label: "Direction",
        hint: "Which way text runs around the button, set on the box that holds it. A right-to-left box makes a horizontal button slide leftward; a vertical one is unaffected.",
        controls: "Sets dir on the box around the button",
    };
}
