export namespace TilterKnobs {
    export const MIN_TILT_DEGREES = 0;
    export const MAX_TILT_DEGREES = 45;
    export const TILT_STEP_DEGREES = 1;

    export const MIN_PERSPECTIVE_PX = 200;
    export const MAX_PERSPECTIVE_PX = 3000;
    export const PERSPECTIVE_STEP_PX = 50;

    export const MIN_SHEEN_OPACITY = 0;
    export const MAX_SHEEN_OPACITY = 1;
    export const SHEEN_OPACITY_STEP = 0.05;
    export const STARTING_SHEEN_OPACITY = 0.8;

    export const MIN_SHEEN_SPREAD = 1;
    export const MAX_SHEEN_SPREAD = 50;
    export const SHEEN_SPREAD_STEP = 1;
    export const STARTING_SHEEN_SPREAD = 15;

    export const MIN_ACTIVE_RANGE_PX = 40;
    export const MAX_ACTIVE_RANGE_PX = 1200;
    export const ACTIVE_RANGE_STEP_PX = 20;
    export const STARTING_ACTIVE_RANGE_PX = 400;

    export const MIN_TILT_RANGE_PX = 40;
    export const MAX_TILT_RANGE_PX = 1200;
    export const TILT_RANGE_STEP_PX = 20;

    export const MIN_SMOOTHING_MS = 0;
    export const MAX_SMOOTHING_MS = 1000;
    export const SMOOTHING_STEP_MS = 10;

    export const STARTING_IS_DISABLED = false;

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Stops the surface following the pointer and leaves it flat. It is what a page honoring a reduced-motion preference passes.",
        controls: "Sets TilterProps.isDisabled",
    };

    export const SMOOTHING_MS_TEXT = {
        label: "Smoothing (ms)",
        hint: "How long the surface takes to catch up with the pointer. At 0 it follows exactly; raised, it lags a quick movement and glides back flat when the pointer leaves.",
        controls: "Sets TilterProps.smoothingMs",
    };

    export const ACTIVE_RANGE_PX_TEXT = {
        label: "Active range (px)",
        hint: "How near the pointer has to be before the surface answers it at all, measured from the area's center. Outside it the surface lies flat.",
        controls: "Sets TilterProps.activeRangePx",
    };

    export const TILT_RANGE_PX_TEXT = {
        label: "Tilt range (px)",
        hint: "How far from the center the pointer starts to tip the surface. The turn is strongest at the surface's own edge and fades to nothing out at this distance.",
        controls: "Sets TilterProps.tiltRangePx",
    };

    export const MAX_TILT_DEGREES_TEXT = {
        label: "Max tilt (deg)",
        hint: "How far the surface turns when the pointer is at the very edge of the tilted area.",
        controls: "Sets TilterProps.maxTiltDegrees",
    };

    export const PERSPECTIVE_PX_TEXT = {
        label: "Perspective (px)",
        hint: "How near the viewer sits. Smaller is a more violent perspective; larger flattens the turn.",
        controls: "Sets TilterProps.perspectivePx",
    };

    export const SHEEN_OPACITY_TEXT = {
        label: "Sheen opacity",
        hint: "How strong the highlight is. It belongs to the page rather than to the component.",
        controls: "Sets the opacity of the example sheen drawn by TilterProps.renderSheen",
    };

    export const SHEEN_SPREAD_PERCENT_TEXT = {
        label: "Sheen spread (%)",
        hint: "How wide the band of highlight is across the surface.",
        controls: "Sets the spread of the example sheen drawn by TilterProps.renderSheen",
    };
}
