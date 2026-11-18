export namespace ProximityTextKnobs {
    export const MIN_REACH_PX = 20;
    export const MAX_REACH_PX = 400;
    export const REACH_STEP_PX = 10;
    export const STARTING_IS_DISABLED = false;
    export const WAVE_LAP_MS = 4000;
    export const BOX_WIDTH = 360;
    export const BARREL_BOX_HEIGHT = 240;
    export const BARREL_REACH_PX = 120;

    export const REACH_PX_TEXT = {
        label: "Reach (px)",
        hint: "How far from a letter's middle the point still reaches it. Past it, the letter rests.",
        controls: "Sets ProximityTextProps.reachPx",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Rests every letter and stops following the point. It is what a page honoring a reduced-motion preference passes.",
        controls: "Sets ProximityTextProps.isDisabled",
    };
}
