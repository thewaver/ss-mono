import type { AccessorProps, ColorAreaRenderProps, InteractionFlags, RangeRenderProps } from "@thewaver/ss-components";

export type ColorAreaContentProps = AccessorProps<{
    renderProps: InteractionFlags<ColorAreaRenderProps>;
    size: number;
}>;

export type ColorSwatchProps = AccessorProps<{
    value: string;
}>;

export type ColorFieldTriggerProps = AccessorProps<{
    flags: InteractionFlags;
}>;

export type HueSliderProps = AccessorProps<{
    renderProps: InteractionFlags<RangeRenderProps>;
}>;
