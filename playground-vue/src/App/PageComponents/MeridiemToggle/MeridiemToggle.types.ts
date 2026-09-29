import type { TimeValueMeridiem } from "@thewaver/ss-utils";

export type MeridiemToggleProps = {
    meridiem: TimeValueMeridiem;
    isDisabled?: boolean;
    onToggle: () => void;
};
