import { ShapeConst } from "@thewaver/ss-utils";

import type { RevealShape } from "../Pages/Reveals/RevealPage/RevealPage.types";

export namespace RevealKnobs {
    export const CIRCLE = "circle";
    export const SHAPES: readonly RevealShape[] = [CIRCLE, ...ShapeConst.DEFAULT_SHAPES];

    export const MIN_RADIUS = 20;
    export const MAX_RADIUS = 220;
    export const RADIUS_STEP = 10;
    export const MIN_JOIN_RADIUS = 0;
    export const MAX_JOIN_RADIUS = 120;
    export const JOIN_RADIUS_STEP = 5;
    export const MIN_LAME_EXPONENT = -5;
    export const MAX_LAME_EXPONENT = 5;
    export const LAME_EXPONENT_STEP = 0.5;
    export const MIN_SOFTNESS = 0;
    export const MAX_SOFTNESS = 1;
    export const SOFTNESS_STEP = 0.05;
    export const STARTING_SHAPE: RevealShape = CIRCLE;
    export const STARTING_JOIN_RADIUS = 0;
    export const STARTING_LAME_EXPONENT = 1;
    export const STARTING_IS_DISABLED = false;
    export const MIN_STEP_SIZE = 5;
    export const MAX_STEP_SIZE = 80;
    export const STEP_SIZE_STEP = 5;
}
