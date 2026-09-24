import { ShapeConst } from "@thewaver/ss-utils";

export namespace ScratchCardKnobs {
    export const CIRCLE = "circle";
    export const BRUSH_SHAPES = [CIRCLE, ...ShapeConst.DEFAULT_SHAPES] as const;

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

    export const STARTING_BRUSH_SHAPE: (typeof BRUSH_SHAPES)[number] = CIRCLE;
}
