import type { InteractionFlags, RangeRenderProps } from "@thewaver/ss-components";

export type BaseRangeContentValues = {
    renderProps: InteractionFlags<RangeRenderProps>;
    length?: number;
};

export type BaseRangeContentProps = BaseRangeContentValues;
