import { ShapeConst } from "@thewaver/ss-utils";

import type { ShapeRevealShape } from "../Pages/ShapeRevealPage/ShapeRevealPage.types";

export namespace ShapeRevealKnobs {
    export const SHAPES: readonly ShapeRevealShape[] = ["circle", ...ShapeConst.DEFAULT_SHAPES];

    export const MIN_DURATION_MS = 0;
    export const MAX_DURATION_MS = 3000;
    export const DURATION_STEP_MS = 100;
    export const MIN_DELAY_MS = 500;
    export const MAX_DELAY_MS = 5000;
    export const DELAY_STEP_MS = 500;
    export const STARTING_DELAY_MS = 1000;
    export const STARTING_SHAPE: ShapeRevealShape = "circle";
    export const MIN_SOFTNESS = 0;
    export const MAX_SOFTNESS = 1;
    export const SOFTNESS_STEP = 0.05;
    export const MIN_DEGREES = -720;
    export const MAX_DEGREES = 720;
    export const DEGREES_STEP = 15;
    export const STARTING_END_DEGREES = 180;
}
