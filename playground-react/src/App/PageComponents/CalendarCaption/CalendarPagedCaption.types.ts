import type { CalendarPrecision, DateValue } from "@thewaver/ss-components-react";

export type PageCalendarPagedCaptionProps = {
    itemKey: string;
    locale?: string;
    precision: CalendarPrecision;
    previousLabel: string;
    nextLabel: string;
    monthState: readonly [DateValue, (month: DateValue) => void];
};
