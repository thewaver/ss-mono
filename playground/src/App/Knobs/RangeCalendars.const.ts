import type { DateValueCalendarId } from "@thewaver/ss-components";

export namespace RangeCalendarKnobs {
    export const WEEK_STARTS = [0, 1] as const;

    export const STARTING_CALENDAR: DateValueCalendarId = "gregory";

    export const WEEK_STARTS_ON_TEXT = {
        label: "Week starts on",
        hint: "Which day begins a week, which decides the order of the column headings.",
        controls: "Sets RangeCalendarProps.weekStartsOn",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the calendar off: no day can be picked, and the Tab key skips it.",
        controls: "Sets RangeCalendarProps.isDisabled",
    };

    export const CALENDAR_TEXT = {
        label: "Calendar",
        hint: "Which calendar system the month is drawn in.",
        controls: "Converts RangeCalendarProps.month to the chosen calendar",
    };
}
