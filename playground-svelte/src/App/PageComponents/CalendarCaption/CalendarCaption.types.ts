import type { DateValue, ValuePair } from "@thewaver/ss-components-svelte";

export type PageCalendarCaptionProps = {
    itemKey: string;
    locale?: string;
    month: ValuePair<DateValue>;
};
