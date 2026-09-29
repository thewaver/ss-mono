import type { RangeValues } from "@thewaver/ss-components-react";

export type RangeExampleProps = {
    value: readonly [number, (value: number) => void];
};

export type RangePairExampleProps = {
    range: readonly [RangeValues, (range: RangeValues) => void];
};

export type RangePriceExampleProps = RangePairExampleProps & {
    onChangeEnd: (values: number[]) => void;
};

export type RangeVerticalExampleProps = RangeExampleProps & RangePairExampleProps;
