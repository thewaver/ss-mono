import type { SVGDefsSamples } from "@thewaver/ss-components";

import type { WithNoSample } from "../PageComponents/SampleGroups/SampleGroups.types";

export namespace SVGPatternKnobs {
    export const MIN_CELL_SIZE = 10;
    export const MAX_CELL_SIZE = 160;
    export const CELL_SIZE_STEP = 10;
    export const MIN_BLUR_WIDTH = 0;
    export const MAX_BLUR_WIDTH = 40;
    export const BLUR_WIDTH_STEP = 1;
    export const MIN_DURATION_MS = 1000;
    export const MAX_DURATION_MS = 5000;

    export const STARTING_DURATION_MS = 2000;
    export const STARTING_CELL_SIZE = 60;
    export const STARTING_BLUR_WIDTH = 0;
    export const STARTING_PATTERN_KEY: WithNoSample<SVGDefsSamples.Pattern.SampleKey> = "hexagon_pt_2";
    export const STARTING_ITERATION_KEY: SVGDefsSamples.Iteration.SampleKey = "constant";
    export const DURATION_STEP_MS = 100;
}
