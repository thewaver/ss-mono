import type { InteractionFlags, RangeRenderProps } from "@thewaver/ss-components-svelte";

export type RangeContentProps = {
    renderProps: InteractionFlags<RangeRenderProps>;
    length?: number;
};
