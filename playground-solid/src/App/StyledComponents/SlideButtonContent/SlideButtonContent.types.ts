import type { AccessorProps, InteractionFlags, SlideButtonRenderProps } from "@thewaver/ss-components-solid";

export type SlideButtonContentProps = AccessorProps<{
    renderProps: InteractionFlags<SlideButtonRenderProps>;
    width?: number;
}>;
