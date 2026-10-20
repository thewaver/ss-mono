import type { Span } from "@thewaver/ss-utils";

export type RangeExampleProps = {
    value: readonly [number, (value: number) => void];
};

export type RangePairExampleProps = {
    range: readonly [Span, (range: Span) => void];
};

export type RangePriceExampleProps = RangePairExampleProps & {
    onChangeEnd: (values: number[]) => void;
};

export type RangeVerticalExampleProps = RangeExampleProps & RangePairExampleProps;
