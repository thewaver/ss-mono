import { SVGFilterDefs } from "@thewaver/ss-components";

export namespace RGBSplitterKnobs {
    export const MIN_ACTIVE_RANGE_PX = 40;
    export const MAX_ACTIVE_RANGE_PX = 1200;
    export const ACTIVE_RANGE_STEP_PX = 20;
    export const STARTING_ACTIVE_RANGE_PX = 1200;

    export const MIN_SPLIT_RANGE_PX = 40;
    export const MAX_SPLIT_RANGE_PX = 1200;
    export const SPLIT_RANGE_STEP_PX = 20;

    export const MIN_OFFSET_PX = 0;
    export const MAX_OFFSET_PX = 60;
    export const OFFSET_STEP_PX = 1;

    export const MIN_SMOOTHING_MS = 0;
    export const MAX_SMOOTHING_MS = 1000;
    export const SMOOTHING_STEP_MS = 10;

    export const STARTING_IS_DISABLED = false;

    export const FROM_COLOR_SCHEME = "from color-scheme";
    export const COLOR_MIXING_CHOICES = [FROM_COLOR_SCHEME, ...SVGFilterDefs.COLOR_MIXINGS] as const;
}
