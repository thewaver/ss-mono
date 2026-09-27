import type { DateValue } from "@thewaver/ss-components-react";

export type PageCalendarCaptionProps = {
    itemKey: string;
    locale?: string;
    monthState: readonly [DateValue, (month: DateValue) => void];
};
