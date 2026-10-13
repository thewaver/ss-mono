import type { ColorInputRenderProps, InteractionFlags } from "@thewaver/ss-components";

export type BaseColorInputContentValues = {
    renderProps: InteractionFlags<ColorInputRenderProps>;
    isCompact?: boolean;
};

export type BaseColorInputContentProps = BaseColorInputContentValues;
