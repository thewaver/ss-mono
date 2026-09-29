import type { DateValue } from "@thewaver/ss-components-vue";

export type PageCalendarCaptionProps = {
    "itemKey": string;
    "locale"?: string;
    "month": DateValue;
    "onUpdate:month"?: (month: DateValue) => void;
};
