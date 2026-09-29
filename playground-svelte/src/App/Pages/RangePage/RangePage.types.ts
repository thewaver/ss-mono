import type { RangeValues } from "@thewaver/ss-components-svelte";

export type RangeExampleProps = {
    value: number;
};

export type RangePairExampleProps = {
    range: RangeValues;
};

export type RangePriceExampleProps = RangePairExampleProps & {
    onChangeEnd: (values: number[]) => void;
};

export type RangeVerticalExampleProps = RangeExampleProps & RangePairExampleProps;
