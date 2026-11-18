export namespace ShadowCasterKnobs {
    export const MIN_LIGHT_RANGE_PX = 80;
    export const MAX_LIGHT_RANGE_PX = 1200;
    export const LIGHT_RANGE_STEP_PX = 20;

    export const MIN_THROW_PX = 0;
    export const MAX_THROW_PX = 120;
    export const THROW_STEP_PX = 2;

    export const MIN_BLUR_PX = 0;
    export const MAX_BLUR_PX = 60;
    export const BLUR_STEP_PX = 1;

    export const MIN_OPACITY = 0;
    export const MAX_OPACITY = 1;
    export const OPACITY_STEP = 0.05;

    export const MIN_ACTIVE_RANGE_PX = 40;
    export const MAX_ACTIVE_RANGE_PX = 1200;
    export const ACTIVE_RANGE_STEP_PX = 20;
    export const STARTING_ACTIVE_RANGE_PX = 1200;

    export const MIN_SMOOTHING_MS = 0;
    export const MAX_SMOOTHING_MS = 1000;
    export const SMOOTHING_STEP_MS = 10;

    export const STARTING_IS_DISABLED = false;

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Stops the shadow following the pointer and leaves it at rest. It is what a page honoring a reduced-motion preference passes.",
        controls: "Sets ShadowCasterProps.isDisabled",
    };

    export const SMOOTHING_MS_TEXT = {
        label: "Smoothing (ms)",
        hint: "How long the shadow takes to catch up with the pointer. At 0 it follows exactly; raised, it swings after a quick movement and eases back to rest.",
        controls: "Sets ShadowCasterProps.smoothingMs",
    };

    export const ACTIVE_RANGE_PX_TEXT = {
        label: "Active range (px)",
        hint: "How near the pointer has to be before the shadow answers it at all, measured from the content's center. Outside it the shadow rests.",
        controls: "Sets ShadowCasterProps.activeRangePx",
    };

    export const LIGHT_RANGE_PX_TEXT = {
        label: "Light range (px)",
        hint: "How far the pointer's light reaches. Past it the shadow is at its longest and faintest.",
        controls: "Sets ShadowCasterProps.lightRangePx",
    };

    export const MAX_THROW_PX_TEXT = {
        label: "Max throw (px)",
        hint: "How far the shadow is thrown once the pointer is out at the edge of the light.",
        controls: "Sets ShadowCasterProps.maxThrowPx",
    };

    export const MIN_BLUR_PX_TEXT = {
        label: "Near blur (px)",
        hint: "How soft the shadow is with the pointer on the content.",
        controls: "Sets ShadowCasterProps.minBlurPx",
    };

    export const MAX_BLUR_PX_TEXT = {
        label: "Far blur (px)",
        hint: "How soft the shadow is once the pointer is out at the edge of the light.",
        controls: "Sets ShadowCasterProps.maxBlurPx",
    };

    export const MAX_OPACITY_TEXT = {
        label: "Near opacity",
        hint: "How dark the shadow is with the pointer on the content. It fades as the pointer retreats.",
        controls: "Sets ShadowCasterProps.maxOpacity",
    };

    export const MIN_OPACITY_TEXT = {
        label: "Far opacity",
        hint: "How dark the shadow is once the pointer is out at the edge of the light. Nothing, by default.",
        controls: "Sets ShadowCasterProps.minOpacity",
    };

    export const RESTING_OPACITY_TEXT = {
        label: "Resting opacity",
        hint: "How dark the shadow is with no pointer near it at all, or with the effect turned off.",
        controls: "Sets ShadowCasterProps.restingOpacity",
    };

    export const COLOR_TEXT = {
        label: "Color",
        hint: "What the shadow is made of. Whatever alpha it carries is replaced by the opacity ramp.",
        controls: "Sets ShadowCasterProps.color",
    };
}
