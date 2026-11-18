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

    export const DURATION_MS_TEXT = {
        label: "Duration (ms)",
        hint: "How long the circle takes to grow over the whole window. 0 switches the theme at once, as does the system's reduced-motion setting.",
        controls: "Sets ShapeRevealOpts.durationMs",
    };

    export const COMPUTE_POINTS_TEXT = {
        label: "Shape",
        hint: "The contour that grows over the window. A circle is what the reveal draws when none is given.",
        controls: "Picks the example contour sent to ShapeRevealOpts.computePoints",
    };

    export const SOFTNESS_TEXT = {
        label: "Softness",
        hint: "How gradually the growing shape's edge fades, as a share of the distance it grows. 0 gives a hard edge.",
        controls: "Sets ShapeRevealOpts.softness",
    };

    export const START_DEGREES_TEXT = {
        label: "Start angle (°)",
        hint: "The shape's angle as it starts to grow, clockwise. With the end angle the same, the shape is only tilted. A circle looks the same at any angle.",
        controls: "Sets ShapeRevealOpts.startDegrees",
    };

    export const END_DEGREES_TEXT = {
        label: "End angle (°)",
        hint: "The shape's angle once it covers the window. It turns from the start angle to this one as it grows, on the reveal's own timing.",
        controls: "Sets ShapeRevealOpts.endDegrees",
    };
}
