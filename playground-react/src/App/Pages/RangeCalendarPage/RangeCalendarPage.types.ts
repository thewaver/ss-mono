import type { DateValue, DateValueRange, DateValueWeekStart } from "@thewaver/ss-components-react";

export type RangeCalendarExampleProps = {
    weekStartsOn: DateValueWeekStart;
    valueState: readonly [DateValueRange | undefined, (value: DateValueRange | undefined) => void];
    monthState: readonly [DateValue, (month: DateValue) => void];
};
