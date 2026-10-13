import type { ColorAreaRenderProps, InteractionFlags, RangeRenderProps } from "@thewaver/ss-components";

export type BaseColorAreaContentValues = {
    renderProps: InteractionFlags<ColorAreaRenderProps>;
    size: number;
};

export type BaseColorAreaContentProps = BaseColorAreaContentValues;

export type BaseColorSwatchValues = {
    value: string;
};

export type BaseColorSwatchProps = BaseColorSwatchValues;

export type BaseColorFieldTriggerValues = {
    flags: InteractionFlags;
};

export type BaseColorFieldTriggerProps = BaseColorFieldTriggerValues;

export type BaseHueSliderValues = {
    renderProps: InteractionFlags<RangeRenderProps>;
};

export type BaseHueSliderProps = BaseHueSliderValues;
