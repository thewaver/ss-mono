import { ShapeConst } from "@thewaver/ss-utils";

import type { RevealShape } from "../Pages/Reveals/RevealPage/RevealPage.types";

export namespace RevealKnobs {
    export const SHAPES: readonly RevealShape[] = ShapeConst.DEFAULT_SHAPES;

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
    export const STARTING_SHAPE: RevealShape = "hectogon";
    export const STARTING_JOIN_RADIUS = 0;
    export const STARTING_LAME_EXPONENT = 1;
    export const STARTING_IS_DISABLED = false;
    export const MIN_STEP_SIZE = 5;
    export const MAX_STEP_SIZE = 80;
    export const STEP_SIZE_STEP = 5;

    export const RADIUS_TEXT = {
        label: "Radius (px)",
        hint: "How large the window that follows the pointer is.",
        controls: "Sets RevealProps.radius",
    };

    export const COMPUTE_POINTS_TEXT = {
        label: "Shape",
        hint: "The contour of the window that follows the pointer.",
        controls: "Picks the example contour sent to RevealProps.computePoints",
    };

    export const JOIN_RADII_TEXT = {
        label: "Corner radius (px)",
        hint: "How far the window's corners are rounded. A circular window has no corners, so it is off then.",
        controls: "Sets every corner of RevealProps.joinRadii",
    };

    export const LAME_EXPONENTS_TEXT = {
        label: "Lamé Exponent",
        hint: "How square or how pinched the window's rounded corners are: 1 is a circular round, higher is squarer.",
        controls: "Sets every corner of RevealProps.lameExponents",
    };

    export const SOFTNESS_TEXT = {
        label: "Softness",
        hint: "How gradually the window fades into what is still covered. 0 gives a hard edge.",
        controls: "Sets RevealProps.softness",
    };

    export const STEP_SIZE_TEXT = {
        label: "Step size (px)",
        hint: "How far one press of an arrow key moves the window. Tab to a reveal and it opens at the center; the arrow keys move it from there.",
        controls: "Sets RevealProps.stepSize",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Stops the window following the pointer or the keyboard, leaving whatever is underneath covered.",
        controls: "Sets RevealProps.isDisabled",
    };
}
