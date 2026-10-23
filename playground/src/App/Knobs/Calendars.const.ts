import type { DateValueCalendarId } from "@thewaver/ss-components";

export namespace CalendarKnobs {
    export const WEEK_STARTS = [0, 1] as const;

    export const MIN_DAYS_IN_FIRST_WEEK = [1, 4] as const;

    export const STARTING_CALENDAR: DateValueCalendarId = "gregory";
}
