export namespace TextAreaKnobs {
    export const MIN_MAX_ROWS = 2;
    export const MAX_MAX_ROWS = 12;
    export const MAX_ROWS_STEP = 1;

    export const IS_READ_ONLY_TEXT = {
        label: "Read-only",
        hint: "Its text can be selected and copied, but neither typing nor pasting changes it.",
        controls: "Sets TextAreaProps.isReadOnly",
    };

    export const HAS_ERROR_TEXT = {
        label: "Error",
        hint: "Marks the field invalid, for screen readers as well as for the painter.",
        controls: "Sets TextAreaProps.hasError",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it.",
        controls: "Sets TextAreaProps.isDisabled",
    };

    export const MAX_ROWS_TEXT = {
        label: "Max rows",
        hint: "The most rows the box grows to before it starts scrolling.",
        controls: "Sets TextAreaProps.maxRows",
    };

    export const TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT = {
        label: "Reachable when disabled",
        hint: "Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on.",
        controls: "Sets TextAreaProps.isReachableWhenDisabled",
    };
}
