import type { Signal } from "solid-js";

import type { AccessorProps, DateValue, DateValueWeekStart } from "@thewaver/ss-components-solid";

export type CalendarExampleProps = AccessorProps<{
    weekStartsOn: DateValueWeekStart;
    value: Signal<DateValue | undefined>;
    month: Signal<DateValue>;
}>;

export type CalendarPrecisionExampleProps = {
    value: Signal<DateValue | undefined>;
    month: Signal<DateValue>;
};
