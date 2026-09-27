import type { DateValue, DateValueCalendarId } from "@thewaver/ss-components-react";
import type { TimeValue } from "@thewaver/ss-utils";

export type DateExampleProps = {
    calendar: DateValueCalendarId;
    valueState: readonly [DateValue | undefined, (value: DateValue | undefined) => void];
};

export type TimeExampleProps = {
    valueState: readonly [TimeValue | undefined, (value: TimeValue | undefined) => void];
};
