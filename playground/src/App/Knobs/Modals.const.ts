export namespace ModalKnobs {
    export const MIN_TRANSITION_MS = 0;
    export const MAX_TRANSITION_MS = 1000;
    export const TRANSITION_STEP_MS = 50;

    export const ALIGNMENT_TEXT = {
        label: "Alignment",
        hint: "Where the dialog sits: in the middle, or against one edge of the screen and stretched along it.",
        controls: "Sets ModalProps.alignment",
    };

    export const TRANSITION_DURATION_MS_TEXT = {
        label: "Transition duration (ms)",
        hint: "How long the dialog and its overlay take to fade in and out. At 0 they appear and go at once.",
        controls: "Sets ModalProps.transitionDurationMs",
    };

    export const IS_DISMISSABLE_ON_OVERLAY_CLICK_TEXT = {
        label: "Closes on overlay click",
        hint: "Whether a press on the overlay beside the dialog closes it.",
        controls: "Sets ModalProps.isDismissableOnOverlayClick",
    };

    export const IS_DISMISSABLE_ON_ESCAPE_TEXT = {
        label: "Closes on Escape",
        hint: "Whether Escape closes the dialog.",
        controls: "Sets ModalProps.isDismissableOnEscape",
    };
}
