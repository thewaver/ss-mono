export namespace SelectKnobs {
    export const MIN_STRESS_COUNT = 0;
    export const MAX_STRESS_COUNT = 200000;
    export const STRESS_COUNT_STEP = 1000;

    export const STARTING_STRESS_COUNT = 10000;

    export const HAS_ERROR_TEXT = {
        label: "Error",
        hint: "Marks the field invalid, for screen readers as well as for the painter.",
        controls: "Sets SelectProps.hasError",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the field off: it does not open, and the Tab key skips it.",
        controls: "Sets SelectProps.isDisabled",
    };

    export const HAS_GROUP_BOXES_TEXT = {
        label: "Group boxes",
        hint: "Draws a box around each group's heading and options.",
        controls: "Passes SelectProps.renderGroupBox, or leaves it out",
    };

    export const IS_REACHABLE_TEXT = {
        label: "Reachable when disabled",
        hint: "Lets the arrow keys stop on the disabled options, which then show a tooltip.",
        controls: "Sets SelectOption.isReachableWhenDisabled on the disabled options",
    };

    export const COUNT_TEXT = {
        label: "Option count",
        hint: "How many options the list holds. Only the ones in view are built.",
        controls: "Sets the number of example options sent to SelectProps.options",
    };

    export const TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT = {
        label: "Reachable when disabled",
        hint: "Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on.",
        controls: "Sets SelectProps.isReachableWhenDisabled",
    };
}
