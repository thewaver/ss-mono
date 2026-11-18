export namespace TimeInputKnobs {
    export const IS_READ_ONLY_TEXT = {
        label: "Read-only",
        hint: "Its time can be selected and copied, but neither typing, pasting nor the arrow keys change it.",
        controls: "Sets TimeInputProps.isReadOnly",
    };

    export const HAS_ERROR_TEXT = {
        label: "Error",
        hint: "Marks the field invalid, for screen readers as well as for the painter. The field also marks itself while what it shows is not a time.",
        controls: "Sets TimeInputProps.hasError",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it.",
        controls: "Sets TimeInputProps.isDisabled",
    };

    export const IS_TWELVE_HOUR_TEXT = {
        label: "Twelve hour",
        hint: "Writes the hours from 1 to 12, with a morning and afternoon marker.",
        controls: "Sets TimeInputProps.isTwelveHour",
    };

    export const HAS_SECONDS_TEXT = {
        label: "Seconds",
        hint: "Adds the seconds to the hours and minutes.",
        controls: "Sets TimeInputProps.hasSeconds",
    };

    export const TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT = {
        label: "Reachable when disabled",
        hint: "Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on.",
        controls: "Sets TimeInputProps.isReachableWhenDisabled",
    };
}
