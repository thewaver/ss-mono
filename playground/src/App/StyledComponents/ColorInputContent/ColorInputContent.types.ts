import type { AccessorProps, ColorInputRenderProps, InteractionFlags } from "@thewaver/ss-components";

export type ColorInputContentProps = AccessorProps<{
    renderProps: InteractionFlags<ColorInputRenderProps>;
    isCompact?: boolean;
}>;
