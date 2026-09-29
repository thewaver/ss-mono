import type { ColorAreaRenderProps, InteractionFlags, RangeRenderProps } from "@thewaver/ss-components-svelte";

export type ColorAreaContentProps = {
    renderProps: InteractionFlags<ColorAreaRenderProps>;
    size: number;
};

export type ColorSwatchProps = {
    value: string;
};

export type ColorFieldTriggerProps = {
    flags: InteractionFlags;
};

export type HueSliderProps = {
    renderProps: InteractionFlags<RangeRenderProps>;
};
