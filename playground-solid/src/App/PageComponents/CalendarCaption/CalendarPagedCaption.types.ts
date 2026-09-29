import type { Signal } from "solid-js";

import type { AccessorProps, CalendarPrecision, DateValue } from "@thewaver/ss-components-solid";

export type PageCalendarPagedCaptionProps = AccessorProps<{
    key: string;
    locale?: string;
    precision: CalendarPrecision;
    previousLabel: string;
    nextLabel: string;
    month: Signal<DateValue>;
}>;
