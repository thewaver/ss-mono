import type { Signal } from "solid-js";

import type { AccessorProps, DateValue, DateValueWeekStart } from "@thewaver/ss-components";

export type CalendarExampleProps = AccessorProps<{
    weekStartsOn: DateValueWeekStart;
    valueSignal: Signal<DateValue | undefined>;
    monthSignal: Signal<DateValue>;
}>;
