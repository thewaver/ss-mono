export namespace DrawerKnobs {
    export const EDGE_TEXT = {
        label: "Edge",
        hint: "Which edge of the screen the drawer is attached to. It fills the length of that edge, and the painter slides it in from there.",
        controls: "Sets DrawerProps.edge",
    };

    export const TRANSITION_DURATION_MS_TEXT = {
        label: "Transition duration (ms)",
        hint: "How long the drawer and its overlay take to arrive and leave. At 0 they appear and go at once.",
        controls: "Sets DrawerProps.transitionDurationMs",
    };

    export const IS_DISMISSABLE_ON_OVERLAY_CLICK_TEXT = {
        label: "Closes on overlay click",
        hint: "Whether a press on the overlay closes the drawer. Off, the drawer cannot be swiped away either.",
        controls: "Sets DrawerProps.isDismissableOnOverlayClick",
    };
}
