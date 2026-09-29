import type { ColorInputRenderProps, InteractionFlags } from "@thewaver/ss-components-svelte";

export type ColorInputContentProps = {
    renderProps: InteractionFlags<ColorInputRenderProps>;
    isCompact?: boolean;
};
