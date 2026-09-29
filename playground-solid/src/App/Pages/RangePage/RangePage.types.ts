import type { Signal } from "solid-js";

import type { RangeValues } from "@thewaver/ss-components-solid";

export type RangeExampleProps = {
    value: Signal<number>;
};

export type RangePairExampleProps = {
    range: Signal<RangeValues>;
};

export type RangePriceExampleProps = RangePairExampleProps & {
    onChangeEnd: (values: number[]) => void;
};

export type RangeVerticalExampleProps = RangeExampleProps & RangePairExampleProps;
