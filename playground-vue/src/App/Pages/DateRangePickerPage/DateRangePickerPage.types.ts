import type { DateValueCalendarId, DateValueRange } from "@thewaver/ss-components-vue";

export type DateRangeExampleProps = {
    "calendar": DateValueCalendarId;
    "value": DateValueRange | undefined;
    "onUpdate:value"?: (value: DateValueRange | undefined) => void;
};
