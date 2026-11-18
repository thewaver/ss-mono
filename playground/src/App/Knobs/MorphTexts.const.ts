export namespace MorphTextKnobs {
    export const MIN_MORPH_DURATION_MS = 0;
    export const MAX_MORPH_DURATION_MS = 3000;
    export const MORPH_DURATION_STEP_MS = 100;

    export const MIN_MAX_BLUR_PX = 1;
    export const MAX_MAX_BLUR_PX = 30;
    export const MAX_BLUR_STEP_PX = 1;

    export const CYCLE_MS = 2600;

    export const MORPH_DURATION_MS_TEXT = {
        label: "Morph duration (ms)",
        hint: "How long one word takes to melt into the next. It is off while the visitor has asked for reduced motion.",
        controls: "Sets MorphTextProps.morphDurationMs",
    };

    export const MAX_BLUR_PX_TEXT = {
        label: "Blur (px)",
        hint: "The most either word is blurred while they cross. More blur melts more of the letters together.",
        controls: "Sets MorphTextProps.maxBlurPx",
    };
}
