import type { Signal } from "solid-js";

import type { AccessorProps, DateValue, DateValueCalendarId } from "@thewaver/ss-components-solid";
import type { TimeValue } from "@thewaver/ss-utils";

export type DateExampleProps = AccessorProps<{
    calendar: DateValueCalendarId;
    value: Signal<DateValue | undefined>;
}>;

export type TimeExampleProps = {
    value: Signal<TimeValue | undefined>;
};
