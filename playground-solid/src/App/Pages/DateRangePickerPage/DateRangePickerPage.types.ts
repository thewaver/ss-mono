import type { Signal } from "solid-js";

import type { AccessorProps, DateValueCalendarId, DateValueRange } from "@thewaver/ss-components-solid";

export type DateRangeExampleProps = AccessorProps<{
    calendar: DateValueCalendarId;
    valueSignal: Signal<DateValueRange | undefined>;
}>;
