import type { Signal } from "solid-js";

import type { AccessorProps, DateValue } from "@thewaver/ss-components";

export type PageCalendarCaptionProps = {
    monthSignal: Signal<DateValue>;
} & AccessorProps<{
    key: string;
    locale?: string;
}>;
