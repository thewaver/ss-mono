import type { DateValue, DateValueRange, DateValueWeekStart } from "@thewaver/ss-components-svelte";

export type RangeCalendarExampleProps = {
    weekStartsOn: DateValueWeekStart;
    value: DateValueRange | undefined;
    month: DateValue;
};
