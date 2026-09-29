import type { CalendarPrecision, DateValue, ValuePair } from "@thewaver/ss-components-svelte";

export type PageCalendarPagedCaptionProps = {
    itemKey: string;
    locale?: string;
    precision: CalendarPrecision;
    previousLabel: string;
    nextLabel: string;
    month: ValuePair<DateValue>;
};
