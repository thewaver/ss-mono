import type { DateValueCalendarId, DateValueRange } from "@thewaver/ss-components-react";

export type DateRangeExampleProps = {
    calendar: DateValueCalendarId;
    value: readonly [DateValueRange | undefined, (value: DateValueRange | undefined) => void];
};
