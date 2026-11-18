export namespace DateInputKnobs {
    export const IS_READ_ONLY_TEXT = {
        label: "Read-only",
        hint: "Its date can be selected and copied, but neither typing nor pasting changes it.",
        controls: "Sets DateInputProps.isReadOnly",
    };

    export const HAS_ERROR_TEXT = {
        label: "Error",
        hint: "Marks the field invalid, for screen readers as well as for the painter. The field also marks itself while what it shows is not a date.",
        controls: "Sets DateInputProps.hasError",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it.",
        controls: "Sets DateInputProps.isDisabled",
    };

    export const FORMAT_TEXT = {
        label: "Format",
        hint: "The order the parts of the date are typed in, and the separator between them.",
        controls: "Sets DateInputProps.format",
    };

    export const CALENDAR_TEXT = {
        label: "Calendar",
        hint: "Which calendar system the date is read and written in.",
        controls: "Sets DateInputProps.calendar",
    };

    export const TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT = {
        label: "Reachable when disabled",
        hint: "Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on.",
        controls: "Sets DateInputProps.isReachableWhenDisabled",
    };
}
