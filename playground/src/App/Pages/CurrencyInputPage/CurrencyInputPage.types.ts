import type { Signal } from "solid-js";

import type { AccessorProps, MaybeAccessor } from "@thewaver/ss-components";

export type CurrencyInputExampleProps = AccessorProps<{
    locale: string;
    decimals: number;
    hasSign: boolean;
}> & {
    groupSizes: MaybeAccessor<number[] | undefined>;
    valueSignal: Signal<number | undefined>;
};
