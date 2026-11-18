export namespace SpotlightGuideKnobs {
    export const PADDING_TEXT = {
        label: "Padding (px)",
        hint: "How much room is left around the lit element, so the hole is not cut tight against it.",
        controls: "Sets SpotlightGuideProps.padding",
    };

    export const TRANSITION_DURATION_MS_TEXT = {
        label: "Transition duration (ms)",
        hint: "How long the guide takes to fade in and out, and to move from one step to the next. At 0 it jumps.",
        controls: "Sets SpotlightGuideProps.transitionDurationMs",
    };

    export const POPUP_PLACEMENT_X_TEXT = {
        label: "Popup across",
        hint: "Where the popup sits across the lit element: lined up with an edge from inside, centered, or outside it altogether.",
        controls: "Sets SpotlightGuideProps.popupPlacement.x",
    };

    export const POPUP_PLACEMENT_Y_TEXT = {
        label: "Popup down",
        hint: "Where the popup sits above or below the lit element: lined up with an edge from inside, centered, or outside it altogether.",
        controls: "Sets SpotlightGuideProps.popupPlacement.y",
    };

    export const POPUP_OFFSET_X_TEXT = {
        label: "Offset across (px)",
        hint: "How far the popup is held clear of the lit element sideways.",
        controls: "Sets SpotlightGuideProps.popupOffset.x",
    };

    export const POPUP_OFFSET_Y_TEXT = {
        label: "Offset down (px)",
        hint: "How far the popup is held clear of the lit element above or below it.",
        controls: "Sets SpotlightGuideProps.popupOffset.y",
    };
}
