import { SHAPE_REVEAL_SPOTS } from "@thewaver/ss-components";
import { ShapeConst } from "@thewaver/ss-utils";

import type { ShapeRevealPageOrigin, ShapeRevealPageShape } from "../Pages/ShapeRevealPage/ShapeRevealPage.types";

export namespace ShapeRevealKnobs {
    export const CIRCLE = "circle";
    export const BUTTON = "button";
    export const SHAPES: readonly ShapeRevealPageShape[] = [CIRCLE, ...ShapeConst.DEFAULT_SHAPES];
    export const ORIGINS: readonly ShapeRevealPageOrigin[] = [BUTTON, ...SHAPE_REVEAL_SPOTS];
    export const STARTING_SHAPE: ShapeRevealPageShape = CIRCLE;
    export const STARTING_ORIGIN: ShapeRevealPageOrigin = BUTTON;

    export const MIN_DURATION_MS = 100;
    export const MAX_DURATION_MS = 3000;
    export const DURATION_STEP_MS = 100;

    export const MIN_BLUR = 0;
    export const MAX_BLUR = 60;
    export const BLUR_STEP = 2;
}
