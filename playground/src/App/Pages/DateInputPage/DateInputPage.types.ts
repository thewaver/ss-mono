import type { DateInputFormat, DateValueCalendarId } from "@thewaver/ss-components";

export type BaseDateInputBasicDocsExampleValues = {
    isReadOnly: boolean;
    hasError: boolean;
    isDisabled: boolean;
};

export type BaseDateInputDayFirstDocsExampleValues = {
    format: DateInputFormat;
};

export type BaseDateInputCalendarsDocsExampleValues = {
    calendar: DateValueCalendarId;
};

export type BaseDateInputTooltipDocsExampleValues = {
    isReachableWhenDisabled: boolean;
    isDisabled: boolean;
};
