export namespace TimePickerKnobs {
    export const IS_READ_ONLY_TEXT = {
        label: "Read-only",
        hint: "Its time can be selected and copied, but neither typing, pasting nor the arrow keys change it, and the clock cannot be opened.",
        controls: "Sets TimePickerProps.isReadOnly",
    };

    export const HAS_ERROR_TEXT = {
        label: "Error",
        hint: "Marks the field invalid, for screen readers as well as for the painter. The field also marks itself while what it shows is not a time.",
        controls: "Sets TimePickerProps.hasError",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the picker off: nothing can write to the field, the clock cannot be opened, and the Tab key skips both.",
        controls: "Sets TimePickerProps.isDisabled",
    };

    export const IS_TWELVE_HOUR_TEXT = {
        label: "Twelve hour",
        hint: "Writes the hours from 1 to 12, with a morning and afternoon marker.",
        controls: "Sets TimePickerProps.isTwelveHour",
    };

    export const TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT = {
        label: "Reachable when disabled",
        hint: "Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on.",
        controls: "Sets TimePickerProps.isReachableWhenDisabled",
    };
}
