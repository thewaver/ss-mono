import type { DateValue, DateValueWeekStart } from "@thewaver/ss-components-react";

export type CalendarExampleProps = {
    weekStartsOn: DateValueWeekStart;
    value: readonly [DateValue | undefined, (value: DateValue | undefined) => void];
    month: readonly [DateValue, (month: DateValue) => void];
};

export type CalendarPrecisionExampleProps = {
    value: readonly [DateValue | undefined, (value: DateValue | undefined) => void];
    month: readonly [DateValue, (month: DateValue) => void];
};
