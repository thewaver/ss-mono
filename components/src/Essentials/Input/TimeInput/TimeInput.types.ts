import type { TimeValueMeridiem } from "@thewaver/ss-utils";

export type TimeInputMeridiem = {
    getValue: () => TimeValueMeridiem;
    set: (meridiem: TimeValueMeridiem) => void;
    toggle: () => void;
};
