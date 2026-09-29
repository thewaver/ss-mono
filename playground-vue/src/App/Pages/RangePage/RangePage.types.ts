import type { RangeValues } from "@thewaver/ss-components-vue";

export type RangeExampleProps = {
    "value": number;
    "onUpdate:value"?: (value: number) => void;
};

export type RangePairExampleProps = {
    "range": RangeValues;
    "onUpdate:range"?: (range: RangeValues) => void;
};

export type RangePriceExampleProps = RangePairExampleProps & {
    onChangeEnd: (values: number[]) => void;
};

export type RangeVerticalExampleProps = RangeExampleProps & RangePairExampleProps;
