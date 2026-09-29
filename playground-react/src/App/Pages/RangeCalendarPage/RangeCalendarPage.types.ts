import type { DateValue, DateValueRange, DateValueWeekStart } from "@thewaver/ss-components-react";

export type RangeCalendarExampleProps = {
    weekStartsOn: DateValueWeekStart;
    value: readonly [DateValueRange | undefined, (value: DateValueRange | undefined) => void];
    month: readonly [DateValue, (month: DateValue) => void];
};
