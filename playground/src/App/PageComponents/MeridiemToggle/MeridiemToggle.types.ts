import type { TimeValueMeridiem } from "@thewaver/ss-utils";

export type BaseMeridiemToggleValues = {
    meridiem: TimeValueMeridiem;
    isDisabled?: boolean;
};

export type BaseMeridiemToggleCbs = {
    onToggle: () => void;
};

export type BaseMeridiemToggleProps = BaseMeridiemToggleValues & BaseMeridiemToggleCbs;
