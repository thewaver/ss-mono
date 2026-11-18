import type { DateValueCalendarId } from "@thewaver/ss-components";

export namespace CalendarKnobs {
    export const WEEK_STARTS = [0, 1] as const;

    export const MIN_DAYS_IN_FIRST_WEEK = [1, 4] as const;

    export const STARTING_CALENDAR: DateValueCalendarId = "gregory";

    export const WEEK_STARTS_ON_TEXT = {
        label: "Week starts on",
        hint: "Which day begins a week, which decides the order of the column headings.",
        controls: "Sets CalendarProps.weekStartsOn",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the calendar off: no day can be picked, and the Tab key skips it.",
        controls: "Sets CalendarProps.isDisabled",
    };

    export const MIN_DAYS_IN_FIRST_WEEK_TEXT = {
        label: "First week holds",
        hint: "How many days of the new year the first week must hold, which decides the week numbers.",
        controls: "Sets CalendarProps.minDaysInFirstWeek",
    };

    export const CALENDAR_TEXT = {
        label: "Calendar",
        hint: "Which calendar system the month is drawn in.",
        controls: "Converts CalendarProps.month to the chosen calendar",
    };
}
