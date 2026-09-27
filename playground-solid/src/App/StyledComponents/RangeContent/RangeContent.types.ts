import type { AccessorProps, InteractionFlags, RangeRenderProps } from "@thewaver/ss-components-solid";

export type RangeContentProps = AccessorProps<{
    renderProps: InteractionFlags<RangeRenderProps>;
    length?: number;
}>;
