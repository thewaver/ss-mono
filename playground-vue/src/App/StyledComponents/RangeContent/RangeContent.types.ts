import type { InteractionFlags, RangeRenderProps } from "@thewaver/ss-components-vue";

export type RangeContentProps = {
    renderProps: InteractionFlags<RangeRenderProps>;
    length?: number;
};
