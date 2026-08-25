import type { Signal } from "solid-js";

import type { AccessorProps, DateValue, DateValueRange, DateValueWeekStart } from "@thewaver/ss-components";

export type RangeCalendarExampleProps = AccessorProps<{
    weekStartsOn: DateValueWeekStart;
}> & {
    valueSignal: Signal<DateValueRange | undefined>;
    monthSignal: Signal<DateValue>;
};
