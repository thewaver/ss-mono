export namespace FlipbookKnobs {
    export const MIN_DURATION_MS = 0;
    export const MAX_DURATION_MS = 3000;
    export const DURATION_STEP_MS = 100;

    export const TRANSITION_DURATION_MS_TEXT = {
        label: "Turn duration (ms)",
        hint: "How long one page takes to turn over. It is off while the visitor has asked for reduced motion, and the pages then turn at once.",
        controls: "Sets FlipbookProps.transitionDurationMs",
    };
}
