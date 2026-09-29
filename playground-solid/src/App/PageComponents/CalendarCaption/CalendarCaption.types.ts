import type { Signal } from "solid-js";

import type { AccessorProps, DateValue } from "@thewaver/ss-components-solid";

export type PageCalendarCaptionProps = AccessorProps<{
    key: string;
    locale?: string;
    month: Signal<DateValue>;
}>;
