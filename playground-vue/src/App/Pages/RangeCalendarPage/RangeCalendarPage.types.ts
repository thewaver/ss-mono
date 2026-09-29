import type { DateValue, DateValueRange, DateValueWeekStart } from "@thewaver/ss-components-vue";

export type RangeCalendarExampleProps = {
    "weekStartsOn": DateValueWeekStart;
    "value": DateValueRange | undefined;
    "onUpdate:value"?: (value: DateValueRange | undefined) => void;
    "month": DateValue;
    "onUpdate:month"?: (month: DateValue) => void;
};
