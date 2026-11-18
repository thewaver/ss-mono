export namespace DateRangePickerKnobs {
    export const IS_READ_ONLY_TEXT = {
        label: "Read-only",
        hint: "Its dates can be selected and copied, but neither typing nor pasting changes them, and the calendar cannot be opened.",
        controls: "Sets DateRangePickerProps.isReadOnly",
    };

    export const HAS_ERROR_TEXT = {
        label: "Error",
        hint: "Marks both fields invalid, for screen readers as well as for the painter. Each field also marks itself while what it shows is not a date.",
        controls: "Sets DateRangePickerProps.hasError",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the picker off: nothing can write to either field, the calendar cannot be opened, and the Tab key skips all three.",
        controls: "Sets DateRangePickerProps.isDisabled",
    };

    export const CALENDAR_TEXT = {
        label: "Calendar",
        hint: "Which calendar system the dates are read and written in.",
        controls: "Sets DateRangePickerProps.calendar",
    };

    export const TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT = {
        label: "Reachable when disabled",
        hint: "Keeps a disabled picker's tooltip available: the Tab key can stop on its fields and hovering them shows the tooltip. Without it a disabled picker shows no tooltip at all. It only matters while Disabled is on.",
        controls: "Sets DateRangePickerProps.isReachableWhenDisabled",
    };
}
