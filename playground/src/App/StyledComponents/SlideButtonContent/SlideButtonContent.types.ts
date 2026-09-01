import type { AccessorProps, InteractionFlags, SlideButtonRenderProps } from "@thewaver/ss-components";

export type SlideButtonContentProps = AccessorProps<{
    renderProps: InteractionFlags<SlideButtonRenderProps>;
    width?: number;
}>;
