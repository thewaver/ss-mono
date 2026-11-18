export namespace SunburstKnobs {
    export const MIN_RING_COUNT = 1;
    export const MAX_RING_COUNT = 4;
    export const RING_COUNT_STEP = 1;
    export const MIN_ZOOM_DURATION_MS = 0;
    export const MAX_ZOOM_DURATION_MS = 3000;
    export const ZOOM_DURATION_STEP_MS = 50;

    export const RING_COUNT_TEXT = {
        label: "Rings",
        hint: "How many levels are drawn around the middle at once.",
        controls: "Sets SunburstProps.ringCount",
    };

    export const ZOOM_DURATION_MS_TEXT = {
        label: "Zoom duration (ms)",
        hint: "How long a zoom in or out takes. It is off while the visitor has asked for reduced motion, and 0 jumps straight to the new level.",
        controls: "Sets SunburstProps.zoomDurationMs",
    };
}
