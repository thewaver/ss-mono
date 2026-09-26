import type { SVGDefsSamples } from "@thewaver/ss-components";
import type { ShapeConst } from "@thewaver/ss-utils";

import type { WithNoSample } from "../PageComponents/SampleGroups/SampleGroups.types";

export namespace ShapeKnobs {
    export const MIN_EDGE_THICKNESS = 0;
    export const MAX_EDGE_THICKNESS = 80;
    export const EDGE_THICKNESS_STEP = 1;
    export const MIN_JOIN_RADIUS = 0;
    export const MAX_JOIN_RADIUS = 160;
    export const JOIN_RADIUS_STEP = 5;
    export const MIN_LAME_EXPONENT = -5;
    export const MAX_LAME_EXPONENT = 5;
    export const LAME_EXPONENT_STEP = 0.5;
    export const MIN_CELL_SIZE = 10;
    export const MAX_CELL_SIZE = 160;
    export const CELL_SIZE_STEP = 10;
    export const MIN_BLUR_WIDTH = 0;
    export const MAX_BLUR_WIDTH = 40;
    export const BLUR_WIDTH_STEP = 1;
    export const MIN_DURATION_MS = 1000;
    export const MAX_DURATION_MS = 5000;
    export const MIN_STAR_POINTS = 3;
    export const MAX_STAR_POINTS = 16;
    export const STAR_POINTS_STEP = 1;

    export const STARTING_BLUR_WIDTH = 8;
    export const STARTING_DURATION_MS = 2000;
    export const STARTING_CELL_SIZE = 40;
    export const STARTING_HAS_INDIVIDUAL_CORNERS = false;
    export const STARTING_SHOULD_CLIP_CHILDREN = true;
    export const STARTING_SHOULD_PAD_CHILDREN = true;
    export const STARTING_SHAPE_KIND: ShapeConst.DefaultShape = "square";
    export const STARTING_TEXT_WRAP_SHAPE_KIND: ShapeConst.DefaultShape = "lozenge";
    export const STARTING_EDGE_THICKNESS = 4;
    export const STARTING_STAR_POINTS = 4;
    export const STARTING_JOIN_RADII: number[] = [40, 40, 40, 40, 40, 40];
    export const STARTING_LAME_EXPONENTS: number[] = [1, 1, 1, 1, 1, 1];
    export const STARTING_GRADIENT_KEY: WithNoSample<SVGDefsSamples.Gradient.Timed.SampleKey> = "sweep_diag_1v1";
    export const STARTING_ITERATION_KEY: SVGDefsSamples.Iteration.SampleKey = "constant";
    export const DURATION_STEP_MS = 100;
}
