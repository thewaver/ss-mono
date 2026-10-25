import type { RangeOrientation } from "@thewaver/ss-components";

export type BaseRangeBasicDocsExampleValues = {
    orientation: RangeOrientation;
    hasError: boolean;
    isDisabled: boolean;
};

export type BaseRangeSteppingDocsExampleValues = {
    min: number;
    max: number;
    step: number;
};

export type BaseRangePairDocsExampleValues = {
    isDisabled: boolean;
};

export type BaseRangeTooltipDocsExampleValues = {
    isReachableWhenDisabled: boolean;
    isDisabled: boolean;
};
