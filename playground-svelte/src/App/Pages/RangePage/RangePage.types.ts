import type { Span } from "@thewaver/ss-utils";

export type RangeExampleProps = {
    value: number;
};

export type RangePairExampleProps = {
    range: Span;
};

export type RangePriceExampleProps = RangePairExampleProps & {
    onChangeEnd: (values: number[]) => void;
};

export type RangeVerticalExampleProps = RangeExampleProps & RangePairExampleProps;
