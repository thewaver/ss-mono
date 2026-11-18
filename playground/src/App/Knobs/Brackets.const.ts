export namespace BracketKnobs {
    export const MIN_LAYER_GAP = 10;
    export const MAX_LAYER_GAP = 120;
    export const LAYER_GAP_STEP = 2;
    export const MIN_CROSS_GAP = 0;
    export const MAX_CROSS_GAP = 60;
    export const CROSS_GAP_STEP = 2;
    export const MIN_TRANSITION_DURATION_MS = 0;
    export const MAX_TRANSITION_DURATION_MS = 2000;
    export const TRANSITION_DURATION_STEP_MS = 50;
    export const STARTING_IS_SNAPPING_TO_FAMILY = true;
    export const FAMILY_MARGIN = 12;

    export const IS_SNAPPING_TO_FAMILY_TEXT = {
        label: "Snap to family",
        hint: "Glides the window to frame the family in it once a drag, a pinch or the wheel is over.",
        controls: "Sets BracketProps.isSnappingToFamily",
    };

    export const CONNECTOR_TEXT = {
        label: "Connectors",
        hint: "The line drawn between a match and the one it feeds: straight, elbowed, or curved.",
        controls: "Picks the sample connector drawn by BracketProps.renderConnector",
    };

    export const IS_BEAM_PLAYING_TEXT = {
        label: "Beams moving",
        hint: "Whether the pulse runs along the lines between the focused node and the final. It starts stopped while the visitor has asked for reduced motion.",
        controls: "Plays the example beam drawn by BracketProps.renderConnector",
    };

    export const ORIENTATION_TEXT = {
        label: "Orientation",
        hint: "Whether the rounds run across the page or down it.",
        controls: "Sets BracketProps.orientation",
    };

    export const ROOT_SIDE_TEXT = {
        label: "Root side",
        hint: "Which end the final holds, and so which way the rounds read.",
        controls: "Sets BracketProps.rootSide",
    };

    export const LAYER_GAP_TEXT = {
        label: "Layer gap (px)",
        hint: "The space between one round and the next.",
        controls: "Sets BracketProps.layerGap",
    };

    export const CROSS_GAP_TEXT = {
        label: "Row gap (px)",
        hint: "The space between two matches in the same round.",
        controls: "Sets BracketProps.crossGap",
    };

    export const TRANSITION_DURATION_MS_TEXT = {
        label: "Glide (ms)",
        hint: "How long the family example takes to glide from one family to the next. It is off while the visitor has asked for reduced motion.",
        controls: "Sets BracketProps.transitionDurationMs",
    };
}
