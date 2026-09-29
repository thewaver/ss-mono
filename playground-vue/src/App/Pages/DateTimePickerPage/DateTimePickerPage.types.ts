import type { DateTimeValue } from "@thewaver/ss-components-vue";

export type DateTimeExampleProps = {
    "value": DateTimeValue | undefined;
    "onUpdate:value"?: (value: DateTimeValue | undefined) => void;
};
