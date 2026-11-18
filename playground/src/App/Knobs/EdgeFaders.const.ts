export namespace EdgeFaderKnobs {
    export const MIN_SIZE = 0;
    export const MAX_SIZE = 120;
    export const SIZE_STEP = 4;

    export const SIZE_TEXT = {
        label: "Fade size (px)",
        hint: "How far in from each chosen side the fade reaches.",
        controls: "Sets EdgeFaderProps.size",
    };

    export const IS_SCROLL_AWARE_TEXT = {
        label: "Scroll-aware",
        hint: "Whether a side fades only while there is more to scroll to past it.",
        controls: "Sets EdgeFaderProps.isScrollAware",
    };
}
