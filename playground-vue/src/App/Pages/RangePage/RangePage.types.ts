import type { Span } from "@thewaver/ss-utils";

export type RangeExampleProps = {
    "value": number;
    "onUpdate:value"?: (value: number) => void;
};

export type RangePairExampleProps = {
    "range": Span;
    "onUpdate:range"?: (range: Span) => void;
};

export type RangePriceExampleProps = RangePairExampleProps & {
    onChangeEnd: (values: number[]) => void;
};

export type RangeVerticalExampleProps = RangeExampleProps & RangePairExampleProps;
