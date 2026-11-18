export namespace DateTimePickerKnobs {
    export const IS_READ_ONLY_TEXT = {
        label: "Read-only",
        hint: "Its date and time can be selected and copied, but neither typing, pasting nor the arrow keys change them, and neither popup can be opened.",
        controls: "Sets DateTimePickerProps.isReadOnly",
    };

    export const HAS_ERROR_TEXT = {
        label: "Error",
        hint: "Marks both fields invalid, for screen readers as well as for the painter. Each field also marks itself while what it shows cannot be read.",
        controls: "Sets DateTimePickerProps.hasError",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the picker off: nothing can write to either field, neither popup can be opened, and the Tab key skips them all.",
        controls: "Sets DateTimePickerProps.isDisabled",
    };

    export const IS_TWELVE_HOUR_TEXT = {
        label: "Twelve hour",
        hint: "Writes the hours from 1 to 12, with a morning and afternoon marker.",
        controls: "Sets DateTimePickerProps.isTwelveHour",
    };

    export const HAS_SECONDS_TEXT = {
        label: "Seconds",
        hint: "Adds the seconds to the hours and minutes, in the field and in the clock.",
        controls: "Sets DateTimePickerProps.hasSeconds",
    };

    export const TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT = {
        label: "Reachable when disabled",
        hint: "Keeps a disabled picker's tooltip available: the Tab key can stop on its fields and hovering them shows the tooltip. Without it a disabled picker shows no tooltip at all. It only matters while Disabled is on.",
        controls: "Sets DateTimePickerProps.isReachableWhenDisabled",
    };
}
