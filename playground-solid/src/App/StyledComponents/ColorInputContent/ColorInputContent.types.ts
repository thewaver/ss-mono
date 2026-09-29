import type { AccessorProps, ColorInputRenderProps, InteractionFlags } from "@thewaver/ss-components-solid";

export type ColorInputContentProps = AccessorProps<{
    renderProps: InteractionFlags<ColorInputRenderProps>;
    isCompact?: boolean;
}>;
