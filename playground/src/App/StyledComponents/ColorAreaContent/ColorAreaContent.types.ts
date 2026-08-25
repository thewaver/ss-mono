import type { AccessorProps, ColorAreaFlags, InteractionFlags, RangeFlags } from "@thewaver/ss-components";

export type ColorAreaContentProps = AccessorProps<{
    flags: InteractionFlags<ColorAreaFlags>;
    size: number;
}>;

export type ColorSwatchProps = AccessorProps<{
    value: string;
}>;

export type ColorFieldTriggerProps = AccessorProps<{
    flags: InteractionFlags;
}>;

export type HueSliderProps = AccessorProps<{
    flags: InteractionFlags<RangeFlags>;
}>;
