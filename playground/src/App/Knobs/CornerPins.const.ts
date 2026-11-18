export namespace CornerPinKnobs {
    export const MIN_REACH_RATIO = 0;
    export const MAX_REACH_RATIO = 1;
    export const REACH_STEP_RATIO = 0.05;

    export const REACH_RATIO_TEXT = {
        label: "Reach",
        hint: "How far past each edge of the box a corner may be taken, as a share of the box. At 0 every corner stays on or inside the box, so the content can only be squeezed; above it, the content can be stretched beyond its own size too.",
        controls: "Sets CornerPinProps.reachRatio",
    };
}
