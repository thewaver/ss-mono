export namespace ToggleKnobs {
    export const HAS_ERROR_TEXT = {
        label: "Error",
        hint: "Marks the toggle invalid, for screen readers as well as for the painter.",
        controls: "Sets ToggleProps.hasError",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the toggle off: neither a click nor Space changes it, and the Tab key skips it.",
        controls: "Sets ToggleProps.isDisabled",
    };

    export const TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT = {
        label: "Reachable when disabled",
        hint: "Keeps a disabled toggle's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled toggle shows no tooltip at all. It only matters while Disabled is on.",
        controls: "Sets ToggleProps.isReachableWhenDisabled",
    };
}
