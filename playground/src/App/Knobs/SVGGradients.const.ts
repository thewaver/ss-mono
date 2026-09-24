import type { SVGDefsSamples } from "@thewaver/ss-components";

import type { WithNoSample } from "../PageComponents/SampleGroups/SampleGroups.types";
import type { SVGGradientsPaintKind } from "../Pages/SVGGradients/SVGGradients.types";

export namespace SVGGradientKnobs {
    export const PAINT_KINDS: SVGGradientsPaintKind[] = ["fill", "stroke"];

    export const MIN_BLUR_WIDTH = 0;
    export const MAX_BLUR_WIDTH = 40;
    export const BLUR_WIDTH_STEP = 1;
    export const MIN_DURATION_MS = 1000;
    export const MAX_DURATION_MS = 5000;
    export const DURATION_STEP_MS = 100;

    export const STARTING_DURATION_MS = 2000;
    export const STARTING_BLUR_WIDTH = 0;
    export const STARTING_TIMED_GRADIENT_KEY: WithNoSample<SVGDefsSamples.Gradient.Timed.SampleKey> = "sweep_diag_1v1";
    export const STARTING_TRACKED_GRADIENT_KEY: WithNoSample<SVGDefsSamples.Gradient.Tracked.SampleKey> = "spot_1";
    export const STARTING_ITERATION_KEY: SVGDefsSamples.Iteration.SampleKey = "constant";
    export const STARTING_PAINT_KIND: SVGGradientsPaintKind = "fill";
}
