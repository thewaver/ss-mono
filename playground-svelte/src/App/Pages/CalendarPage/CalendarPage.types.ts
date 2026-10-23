import type { DateValue, DateValueMinDaysInFirstWeek, DateValueWeekStart } from "@thewaver/ss-components-svelte";

export type CalendarExampleProps = {
    weekStartsOn: DateValueWeekStart;
    value: DateValue | undefined;
    month: DateValue;
};

export type CalendarPrecisionExampleProps = {
    value: DateValue | undefined;
    month: DateValue;
};

export type CalendarWeekNumbersExampleProps = CalendarExampleProps & {
    minDaysInFirstWeek: DateValueMinDaysInFirstWeek;
};
