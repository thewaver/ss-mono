import { ShapeConst } from "@thewaver/ss-utils";

export namespace ScratchCardKnobs {
    export const BRUSH_SHAPES = ShapeConst.DEFAULT_SHAPES;

    export const MIN_PRECISION = 8;
    export const MAX_PRECISION = 64;
    export const PRECISION_STEP = 4;
    export const MIN_BRUSH_RADIUS = 2;
    export const MAX_BRUSH_RADIUS = 90;
    export const BRUSH_STEP = 2;
    export const MIN_SOFTNESS = 0;
    export const MAX_SOFTNESS = 1;
    export const SOFTNESS_STEP = 0.05;
    export const MIN_THRESHOLD = 0.05;
    export const MAX_THRESHOLD = 1;
    export const THRESHOLD_STEP = 0.05;

    export const STARTING_BRUSH_SHAPE: (typeof BRUSH_SHAPES)[number] = "hectogon";

    export const PRECISION_TEXT = {
        label: "Precision",
        hint: "How finely the card measures how much has been scratched off. Finer measurement costs more work each frame.",
        controls: "Sets ScratchCardProps.precision",
    };

    export const BRUSH_RADIUS_TEXT = {
        label: "Brush radius (px)",
        hint: "How large a patch one stroke of the pointer clears.",
        controls: "Sets ScratchCardProps.brushRadius",
    };

    export const BRUSH_SHAPE_TEXT = {
        label: "Brush shape",
        hint: "The contour of the patch a stroke clears.",
        controls: "Picks the example brush contour sent to ScratchCardProps.computePoints",
    };

    export const SOFTNESS_TEXT = {
        label: "Edge softness",
        hint: "How gradually a cleared patch fades into what is still covered. 0 gives a hard edge.",
        controls: "Sets ScratchCardProps.softness",
    };

    export const CLEAR_THRESHOLD_TEXT = {
        label: "Clear threshold",
        hint: "How much of the card has to be scratched off before the rest is cleared for you.",
        controls: "Sets ScratchCardProps.clearThreshold",
    };
}
