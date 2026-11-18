export namespace ClockKnobs {
    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the clock off: no time can be picked, and the Tab key skips it.",
        controls: "Sets ClockProps.isDisabled",
    };

    export const IS_TWELVE_HOUR_TEXT = {
        label: "Twelve hour",
        hint: "Reads the hours from 1 to 12, with a column for morning and afternoon.",
        controls: "Sets ClockProps.isTwelveHour",
    };
}
