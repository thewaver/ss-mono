export namespace SegmentedInputKnobs {
    export const IS_READ_ONLY_TEXT = {
        label: "Read-only",
        hint: "Its code can be selected and copied, but neither typing nor pasting changes it.",
        controls: "Sets SegmentedInputProps.isReadOnly",
    };

    export const HAS_ERROR_TEXT = {
        label: "Error",
        hint: "Marks the field invalid, for screen readers as well as for the painter.",
        controls: "Sets SegmentedInputProps.hasError",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the field off: nothing can write to it, and the Tab key skips it.",
        controls: "Sets SegmentedInputProps.isDisabled",
    };

    export const TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT = {
        label: "Reachable when disabled",
        hint: "Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on.",
        controls: "Sets SegmentedInputProps.isReachableWhenDisabled",
    };
}
