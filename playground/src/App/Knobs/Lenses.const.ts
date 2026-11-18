import { ShapeConst } from "@thewaver/ss-utils";

import type { RevealShape } from "../Pages/Reveals/RevealPage/RevealPage.types";

export namespace LensKnobs {
    export const SHAPES: readonly RevealShape[] = ShapeConst.DEFAULT_SHAPES;

    export const MIN_ZOOM = 1;
    export const MAX_ZOOM = 5;
    export const ZOOM_STEP = 0.25;
    export const MIN_RADIUS = 20;
    export const MAX_RADIUS = 160;
    export const RADIUS_STEP = 10;
    export const MIN_JOIN_RADIUS = 0;
    export const MAX_JOIN_RADIUS = 80;
    export const JOIN_RADIUS_STEP = 5;
    export const MIN_LAME_EXPONENT = -5;
    export const MAX_LAME_EXPONENT = 5;
    export const LAME_EXPONENT_STEP = 0.5;
    export const MIN_SOFTNESS = 0;
    export const MAX_SOFTNESS = 1;
    export const SOFTNESS_STEP = 0.05;
    export const MIN_STEP_SIZE = 5;
    export const MAX_STEP_SIZE = 80;
    export const STEP_SIZE_STEP = 5;
    export const STARTING_SHAPE: RevealShape = "hectogon";
    export const STARTING_JOIN_RADIUS = 0;
    export const STARTING_LAME_EXPONENT = 1;
    export const STARTING_IS_DISABLED = false;

    export const ZOOM_TEXT = {
        label: "Zoom",
        hint: "How many times larger the content is drawn inside the lens. 1 draws it at its own size.",
        controls: "Sets LensProps.zoom",
    };

    export const RADIUS_TEXT = {
        label: "Radius (px)",
        hint: "How large the lens that follows the pointer is.",
        controls: "Sets LensProps.radius",
    };

    export const COMPUTE_POINTS_TEXT = {
        label: "Shape",
        hint: "The contour of the lens.",
        controls: "Picks the example contour sent to LensProps.computePoints",
    };

    export const JOIN_RADII_TEXT = {
        label: "Corner radius (px)",
        hint: "How far the lens's corners are rounded. A circular lens has no corners, so it is off then.",
        controls: "Sets every corner of LensProps.joinRadii",
    };

    export const LAME_EXPONENTS_TEXT = {
        label: "Lamé Exponent",
        hint: "How square or how pinched the lens's rounded corners are: 1 is a circular round, higher is squarer.",
        controls: "Sets every corner of LensProps.lameExponents",
    };

    export const SOFTNESS_TEXT = {
        label: "Softness",
        hint: "How gradually the lens's edge fades into the content around it. 0 gives a hard edge.",
        controls: "Sets LensProps.softness",
    };

    export const STEP_SIZE_TEXT = {
        label: "Step size (px)",
        hint: "How far one press of an arrow key moves the lens. Tab to a lens and it opens at the center; the arrow keys move it from there.",
        controls: "Sets LensProps.stepSize",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Stops the lens following the pointer or the keyboard, leaving the content as it is.",
        controls: "Sets LensProps.isDisabled",
    };
}
