import type { DateValueCalendarId, DateValueMinDaysInFirstWeek, DateValueWeekStart } from "@thewaver/ss-components";

export type BaseCalendarBasicDocsExampleValues = {
    weekStartsOn: DateValueWeekStart;
    isDisabled: boolean;
};

export type BaseCalendarWeekNumbersDocsExampleValues = {
    weekStartsOn: DateValueWeekStart;
    minDaysInFirstWeek: DateValueMinDaysInFirstWeek;
};

export type BaseCalendarCalendarsDocsExampleValues = {
    calendar: DateValueCalendarId;
};
