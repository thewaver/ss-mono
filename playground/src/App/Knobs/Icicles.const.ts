export namespace IcicleKnobs {
    export const MIN_COLUMN_COUNT = 1;
    export const MAX_COLUMN_COUNT = 5;
    export const COLUMN_COUNT_STEP = 1;
    export const MIN_ZOOM_DURATION_MS = 0;
    export const MAX_ZOOM_DURATION_MS = 3000;
    export const ZOOM_DURATION_STEP_MS = 50;

    export const COLUMN_COUNT_TEXT = {
        label: "Columns",
        hint: "How many levels fit across at once, counting the one in view.",
        controls: "Sets IcicleProps.columnCount",
    };

    export const ZOOM_DURATION_MS_TEXT = {
        label: "Zoom duration (ms)",
        hint: "How long a zoom in or out takes. It is off while the visitor has asked for reduced motion, and 0 jumps straight to the new view.",
        controls: "Sets IcicleProps.zoomDurationMs",
    };
}
