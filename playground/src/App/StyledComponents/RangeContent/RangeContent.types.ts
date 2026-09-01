import type { AccessorProps, InteractionFlags, RangeRenderProps } from "@thewaver/ss-components";

export type RangeContentProps = AccessorProps<{
    renderProps: InteractionFlags<RangeRenderProps>;
    length?: number;
}>;
