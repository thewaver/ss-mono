export namespace FileInputKnobs {
    export const HAS_ERROR_TEXT = {
        label: "Error",
        hint: "Marks the control invalid, for screen readers as well as for the painter.",
        controls: "Sets FileInputProps.hasError",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the control off: pressing it opens no dialog, a dropped file is refused, and the Tab key skips it.",
        controls: "Sets FileInputProps.isDisabled",
    };

    export const TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT = {
        label: "Reachable when disabled",
        hint: "Keeps a disabled control's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled control shows no tooltip at all. It only matters while Disabled is on.",
        controls: "Sets FileInputProps.isReachableWhenDisabled",
    };
}
