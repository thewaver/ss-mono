import type { DateValue, DateValueCalendarId } from "@thewaver/ss-components-vue";
import type { TimeValue } from "@thewaver/ss-utils";

export type DateExampleProps = {
    "calendar": DateValueCalendarId;
    "value": DateValue | undefined;
    "onUpdate:value"?: (value: DateValue | undefined) => void;
};

export type TimeExampleProps = {
    "value": TimeValue | undefined;
    "onUpdate:value"?: (value: TimeValue | undefined) => void;
};
