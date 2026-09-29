import type { DateValue } from "@thewaver/ss-components-react";

export type PageCalendarCaptionProps = {
    itemKey: string;
    locale?: string;
    month: readonly [DateValue, (month: DateValue) => void];
};
