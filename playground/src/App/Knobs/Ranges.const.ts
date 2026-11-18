export namespace RangeKnobs {
    export const MIN_LIMIT = -100;
    export const MAX_LIMIT = 100;
    export const LIMIT_STEP = 1;
    export const MIN_STEP = 0.1;
    export const MAX_STEP = 10;
    export const STEP_STEP = 0.1;

    export const ORIENTATION_TEXT = {
        label: "Orientation",
        hint: "Whether the track runs across the page or up it. Upright, the lowest value is at the bottom.",
        controls: "Sets RangeProps.orientation",
    };

    export const HAS_ERROR_TEXT = {
        label: "Error",
        hint: "Marks the range invalid, for screen readers as well as for the painter.",
        controls: "Sets RangeProps.hasError",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the range off: neither dragging nor the arrow keys move it, and the Tab key skips it.",
        controls: "Sets RangeProps.isDisabled",
    };

    export const MIN_TEXT = {
        label: "Min",
        hint: "The lowest value a thumb can take.",
        controls: "Sets RangeProps.min",
    };

    export const MAX_TEXT = {
        label: "Max",
        hint: "The highest value a thumb can take.",
        controls: "Sets RangeProps.max",
    };

    export const STEP_TEXT = {
        label: "Step",
        hint: "How far one press of an arrow key moves a thumb, and the spacing a drag snaps to.",
        controls: "Sets RangeProps.step",
    };

    export const PAIR_IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the range off: neither thumb moves, and the Tab key skips both.",
        controls: "Sets RangeProps.isDisabled",
    };

    export const TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT = {
        label: "Reachable when disabled",
        hint: "Keeps a disabled range's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled range shows no tooltip at all. It only matters while Disabled is on.",
        controls: "Sets RangeProps.isReachableWhenDisabled",
    };
}
