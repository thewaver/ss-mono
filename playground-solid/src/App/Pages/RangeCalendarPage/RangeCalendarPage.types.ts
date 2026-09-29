import type { Signal } from "solid-js";

import type { AccessorProps, DateValue, DateValueRange, DateValueWeekStart } from "@thewaver/ss-components-solid";

export type RangeCalendarExampleProps = AccessorProps<{
    weekStartsOn: DateValueWeekStart;
    value: Signal<DateValueRange | undefined>;
    month: Signal<DateValue>;
}>;
