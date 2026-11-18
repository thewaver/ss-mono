export namespace CornerHighlightKnobs {
    export const MIN_LENGTH = 4;
    export const MAX_LENGTH = 80;
    export const LENGTH_STEP = 4;
    export const MIN_THICKNESS = 1;
    export const MAX_THICKNESS = 16;
    export const THICKNESS_STEP = 1;
    export const MIN_DURATION = 0;
    export const MAX_DURATION = 1000;
    export const DURATION_STEP = 50;

    export const STARTING_COLOR = "#ffd400";
    export const STARTING_LENGTH = 24;

    export const COLOR_TEXT = {
        label: "Color",
        hint: "The color the corner marks are drawn in.",
        controls: "Sets CornerHighlightProps.color",
    };

    export const CORNER_LENGTH_WIDTH_TEXT = {
        label: "Arm across (px)",
        hint: "How long each corner's horizontal arm is.",
        controls: "Sets CornerHighlightProps.cornerLength.width",
    };

    export const CORNER_LENGTH_HEIGHT_TEXT = {
        label: "Arm down (px)",
        hint: "How long each corner's vertical arm is.",
        controls: "Sets CornerHighlightProps.cornerLength.height",
    };

    export const STROKE_THICKNESS_TEXT = {
        label: "Thickness (px)",
        hint: "How thick the corner arms are drawn.",
        controls: "Sets CornerHighlightProps.strokeThickness",
    };

    export const TRANSITION_DURATION_MS_TEXT = {
        label: "Fade (ms)",
        hint: "How long the corners take to follow a change of color, which is how the set as a whole fades. The following and drawn-on examples also glide and grow over this time.",
        controls: "Sets CornerHighlightProps.transitionDurationMs",
    };
}
