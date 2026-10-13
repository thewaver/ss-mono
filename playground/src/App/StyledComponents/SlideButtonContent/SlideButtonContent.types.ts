import type { InteractionFlags, SlideButtonRenderProps } from "@thewaver/ss-components";

export type BaseSlideButtonContentValues = {
    renderProps: InteractionFlags<SlideButtonRenderProps>;
    width?: number;
};

export type BaseSlideButtonContentProps = BaseSlideButtonContentValues;
