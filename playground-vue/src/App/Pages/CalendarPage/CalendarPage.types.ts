import type { DateValue, DateValueWeekStart } from "@thewaver/ss-components-vue";

export type CalendarExampleProps = {
    "weekStartsOn": DateValueWeekStart;
    "value": DateValue | undefined;
    "onUpdate:value"?: (value: DateValue | undefined) => void;
    "month": DateValue;
    "onUpdate:month"?: (month: DateValue) => void;
};

export type CalendarPrecisionExampleProps = {
    "value": DateValue | undefined;
    "onUpdate:value"?: (value: DateValue | undefined) => void;
    "month": DateValue;
    "onUpdate:month"?: (month: DateValue) => void;
};
