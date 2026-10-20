import type { Signal } from "solid-js";

import type { Span } from "@thewaver/ss-utils";

export type RangeExampleProps = {
    value: Signal<number>;
};

export type RangePairExampleProps = {
    range: Signal<Span>;
};

export type RangePriceExampleProps = RangePairExampleProps & {
    onChangeEnd: (values: number[]) => void;
};

export type RangeVerticalExampleProps = RangeExampleProps & RangePairExampleProps;
