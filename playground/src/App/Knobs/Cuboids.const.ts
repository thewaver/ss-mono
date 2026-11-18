export namespace CuboidKnobs {
    export const MIN_EXTENT = 40;
    export const MAX_EXTENT = 400;
    export const EXTENT_STEP = 10;
    export const STARTING_WIDTH = 200;
    export const STARTING_HEIGHT = 260;
    export const STARTING_DEPTH = 120;

    export const MIN_DURATION_MS = 0;
    export const MAX_DURATION_MS = 3000;
    export const DURATION_STEP_MS = 100;
    export const MIN_TURN_INTERVAL_MS = 200;
    export const MAX_TURN_INTERVAL_MS = 5000;
    export const TURN_INTERVAL_STEP_MS = 100;
    export const STARTING_TURN_INTERVAL_MS = 1000;
    export const STARTING_IS_TURNING = true;

    export const STARTING_IS_UPRIGHT = true;
    export const STARTING_IS_DRAGGABLE = true;

    export const IS_TURNING_TEXT = {
        label: "Turns by itself",
        hint: "Lets the box turn to a new face on its own, without anybody clicking it.",
        controls: "Switches on the example timer that writes CuboidProps.yaw and CuboidProps.pitch",
    };

    export const TURN_INTERVAL_MS_TEXT = {
        label: "Turn every (ms)",
        hint: "How long the box rests on a face before turning to the next one. It only applies while the box turns by itself.",
        controls: "Sets how often the example timer writes CuboidProps.yaw and CuboidProps.pitch",
    };

    export const IS_UPRIGHT_TEXT = {
        label: "Stays upright",
        hint: "Every press turns the box a quarter turn about the screen's own axis, as you see it, and the face it lands on is then spun until it reads the right way up. Off, the box goes back to reading the two counts as a pose, where the far side shows upside down once it has been tipped over the top.",
        controls: "Sets CuboidProps.isUpright",
    };

    export const IS_DRAGGABLE_TEXT = {
        label: "Draggable",
        hint: "Lets the box be turned by dragging it. It follows the pointer, and on release settles on the nearest face, writing the turns to the same two counts the buttons do.",
        controls: "Sets CuboidProps.isDraggable",
    };

    export const WIDTH_TEXT = {
        label: "Width (px)",
        hint: "How wide the box is.",
        controls: "Sets CuboidProps.size.width",
    };

    export const HEIGHT_TEXT = {
        label: "Height (px)",
        hint: "How tall the box is.",
        controls: "Sets CuboidProps.size.height",
    };

    export const DEPTH_TEXT = {
        label: "Depth (px)",
        hint: "How deep the box is, front face to back face.",
        controls: "Sets CuboidProps.size.depth",
    };

    export const TRANSITION_DURATION_MS_TEXT = {
        label: "Turn duration (ms)",
        hint: "How long one turn from face to face takes, and how long the box takes to settle after a drag. It is off while the visitor has asked for reduced motion.",
        controls: "Sets CuboidProps.transitionDurationMs",
    };
}
