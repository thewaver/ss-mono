import type { Signal } from "solid-js";

import type { RangeValues } from "@thewaver/ss-components";

export type RangeExampleProps = {
    valueSignal: Signal<number>;
};

export type RangePairExampleProps = {
    rangeSignal: Signal<RangeValues>;
};

export type RangePriceExampleProps = RangePairExampleProps & {
    onChangeEnd: (values: number[]) => void;
};

export type RangeVerticalExampleProps = RangeExampleProps & RangePairExampleProps;
