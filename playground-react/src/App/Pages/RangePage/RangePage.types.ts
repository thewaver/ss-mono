import type { RangeValues } from "@thewaver/ss-components-react";

export type RangeExampleProps = {
    valueState: readonly [number, (value: number) => void];
};

export type RangePairExampleProps = {
    rangeState: readonly [RangeValues, (range: RangeValues) => void];
};

export type RangePriceExampleProps = RangePairExampleProps & {
    onChangeEnd: (values: number[]) => void;
};

export type RangeVerticalExampleProps = RangeExampleProps & RangePairExampleProps;
