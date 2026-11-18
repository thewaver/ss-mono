export namespace TimelineKnobs {
    export const STARTING_IS_PANNABLE = true;
    export const STARTING_IS_ZOOMABLE = true;
    export const STARTING_IS_DISABLED = false;

    export const IS_PANNABLE_TEXT = {
        label: "Drag to move",
        hint: "Lets the timeline be dragged sideways to move through it.",
        controls: "Sets TimelineProps.isPannable",
    };

    export const IS_ZOOMABLE_TEXT = {
        label: "Wheel and pinch to zoom",
        hint: "Lets the wheel and a pinch change how much of the timeline is in view.",
        controls: "Sets TimelineProps.isZoomable",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the timeline off, so it neither pans, zooms nor picks.",
        controls: "Sets TimelineProps.isDisabled",
    };
}
