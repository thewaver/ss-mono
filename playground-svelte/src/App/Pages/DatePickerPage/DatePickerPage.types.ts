import type { DateValue, DateValueCalendarId } from "@thewaver/ss-components-svelte";
import type { TimeValue } from "@thewaver/ss-utils";

export type DateExampleProps = {
    calendar: DateValueCalendarId;
    value: DateValue | undefined;
};

export type TimeExampleProps = {
    value: TimeValue | undefined;
};
