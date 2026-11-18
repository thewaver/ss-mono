export namespace TagInputKnobs {
    export const STARTING_IS_DISABLED = false;
    export const STARTING_HAS_ERROR = false;

    export const HAS_ERROR_TEXT = {
        label: "Error",
        hint: "Marks the field invalid, for screen readers as well as for the painter.",
        controls: "Sets TagInputProps.hasError",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the field off: no tag can be added, none can be removed, and the Tab key skips it.",
        controls: "Sets TagInputProps.isDisabled",
    };

    export const TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT = {
        label: "Reachable when disabled",
        hint: "Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on.",
        controls: "Sets TagInputProps.isReachableWhenDisabled",
    };
}
