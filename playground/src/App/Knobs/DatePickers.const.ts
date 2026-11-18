export namespace DatePickerKnobs {
    export const IS_READ_ONLY_TEXT = {
        label: "Read-only",
        hint: "Its date can be selected and copied, but neither typing nor pasting changes it, and the calendar cannot be opened.",
        controls: "Sets DatePickerProps.isReadOnly",
    };

    export const HAS_ERROR_TEXT = {
        label: "Error",
        hint: "Marks the field invalid, for screen readers as well as for the painter. The field also marks itself while what it shows is not a date.",
        controls: "Sets DatePickerProps.hasError",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the picker off: nothing can write to the field, the calendar cannot be opened, and the Tab key skips both.",
        controls: "Sets DatePickerProps.isDisabled",
    };

    export const CALENDAR_TEXT = {
        label: "Calendar",
        hint: "Which calendar system the date is read and written in.",
        controls: "Sets DatePickerProps.calendar",
    };

    export const TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT = {
        label: "Reachable when disabled",
        hint: "Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on.",
        controls: "Sets DatePickerProps.isReachableWhenDisabled",
    };
}
