import type { DateValue, DateValueWeekStart } from "@thewaver/ss-components-react";

export type CalendarExampleProps = {
    weekStartsOn: DateValueWeekStart;
    valueState: readonly [DateValue | undefined, (value: DateValue | undefined) => void];
    monthState: readonly [DateValue, (month: DateValue) => void];
};

export type CalendarPrecisionExampleProps = {
    valueState: readonly [DateValue | undefined, (value: DateValue | undefined) => void];
    monthState: readonly [DateValue, (month: DateValue) => void];
};
