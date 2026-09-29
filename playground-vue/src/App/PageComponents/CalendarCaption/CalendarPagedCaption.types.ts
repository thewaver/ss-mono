import type { CalendarPrecision, DateValue } from "@thewaver/ss-components-vue";

export type PageCalendarPagedCaptionProps = {
    "itemKey": string;
    "locale"?: string;
    "precision": CalendarPrecision;
    "previousLabel": string;
    "nextLabel": string;
    "month": DateValue;
    "onUpdate:month"?: (month: DateValue) => void;
};
