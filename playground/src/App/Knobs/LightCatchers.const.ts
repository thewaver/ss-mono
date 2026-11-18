export namespace LightCatcherKnobs {
    export const MIN_ACTIVE_RANGE_PX = 40;
    export const MAX_ACTIVE_RANGE_PX = 1200;
    export const ACTIVE_RANGE_STEP_PX = 20;
    export const STARTING_ACTIVE_RANGE_PX = 1200;

    export const MIN_LIGHT_RANGE_PX = 40;
    export const MAX_LIGHT_RANGE_PX = 1200;
    export const LIGHT_RANGE_STEP_PX = 20;

    export const MIN_BRIGHTNESS = 0;
    export const MAX_BRIGHTNESS = 5;
    export const BRIGHTNESS_STEP = 0.05;

    export const MIN_LIGHTNESS = 0;
    export const MAX_LIGHTNESS = 1;
    export const LIGHTNESS_STEP = 0.05;

    export const MIN_SMOOTHING_MS = 0;
    export const MAX_SMOOTHING_MS = 1000;
    export const SMOOTHING_STEP_MS = 10;

    export const STARTING_IS_DISABLED = false;

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Stops the surface answering the pointer and leaves it at its resting brightness and lightness. It is what a page honoring a reduced-motion preference passes.",
        controls: "Sets LightCatcherProps.isDisabled",
    };

    export const SMOOTHING_MS_TEXT = {
        label: "Smoothing (ms)",
        hint: "How long the light takes to catch up with the pointer. At 0 it follows exactly; raised, it glows on after the pointer and fades behind it.",
        controls: "Sets LightCatcherProps.smoothingMs",
    };

    export const ACTIVE_RANGE_PX_TEXT = {
        label: "Active range (px)",
        hint: "How near the pointer has to be before the surface answers it at all, measured from its center. Outside it the surface sits at resting.",
        controls: "Sets LightCatcherProps.activeRangePx",
    };

    export const LIGHT_RANGE_PX_TEXT = {
        label: "Light range (px)",
        hint: "How far the light reaches. Full brightness at the surface's own edge, resting out here.",
        controls: "Sets LightCatcherProps.lightRangePx",
    };

    export const MAX_BRIGHTNESS_TEXT = {
        label: "Max brightness",
        hint: "How bright the surface is with the pointer on it. 1 is the content exactly as painted.",
        controls: "Sets LightCatcherProps.maxBrightness",
    };

    export const RESTING_BRIGHTNESS_TEXT = {
        label: "Resting brightness",
        hint: "How bright the surface is with nothing near it. Below 1 it dims, which turns a row into a spotlight.",
        controls: "Sets LightCatcherProps.restingBrightness",
    };

    export const MAX_LIGHTNESS_TEXT = {
        label: "Max lightness",
        hint: "How far the surface fades toward white with the pointer on it. 0 is untouched. Unlike brightness it lifts the dark parts most, and the two stack.",
        controls: "Sets LightCatcherProps.maxLightness",
    };

    export const RESTING_LIGHTNESS_TEXT = {
        label: "Resting lightness",
        hint: "How far the surface fades toward white with nothing near it. 0 is untouched.",
        controls: "Sets LightCatcherProps.restingLightness",
    };
}
