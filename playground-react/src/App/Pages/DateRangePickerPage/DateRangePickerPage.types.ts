import type { DateValueCalendarId, DateValueRange } from "@thewaver/ss-components-react";

export type DateRangeExampleProps = {
    calendar: DateValueCalendarId;
    valueState: readonly [DateValueRange | undefined, (value: DateValueRange | undefined) => void];
};
