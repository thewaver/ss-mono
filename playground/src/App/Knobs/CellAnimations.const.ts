import type {
    CellAnimationKeyframes,
    CellAnimationOrigins,
    SVGDefsSamples,
    SliceAnimationBreakpointOpts,
    SliceAnimationPlaybackOpts,
    SliceAnimationWeights,
    WeightOpts,
} from "@thewaver/ss-components";
import type { Index2d } from "@thewaver/ss-utils";

import type { SVGDefsSourceRatio } from "../PageComponents/SVGDefsSources/SVGDefsSourceSizes.const";
import type { CellAnimationSourceKind } from "../Pages/CellAnimationPage/CellAnimationPage.types";

export namespace CellAnimationKnobs {
    export const SOURCE_KINDS: CellAnimationSourceKind[] = ["image", "gradient", "pattern"];
    export const DEFAULT_SOURCE_RATIO: SVGDefsSourceRatio = "1:1";

    export const MIN_CELL_COUNT = 1;
    export const MAX_CELL_COUNT = 40;
    export const CELL_COUNT_STEP = 1;
    export const MIN_SMOOTHNESS = 0.05;
    export const MAX_SMOOTHNESS = 1;
    export const SMOOTHNESS_STEP = 0.05;
    export const MIN_DURATION_MS = 100;
    export const MAX_DURATION_MS = 10000;
    export const DURATION_STEP_MS = 100;
    export const MIN_ITERATION_DELAY_MS = 0;
    export const MAX_ITERATION_DELAY_MS = 5000;
    export const MIN_ITERATION_COUNT = -1;
    export const MAX_ITERATION_COUNT = 10;
    export const ENDLESS_ITERATION_COUNT = -1;
    export const MIN_HOLD_MS = 0;
    export const MAX_HOLD_MS = 5000;

    export const STARTING_SOURCE_KIND: CellAnimationSourceKind = "image";
    export const STARTING_CELL_COUNT: Index2d = { row: 11, col: 11 };
    export const STARTING_ORIGIN_KEY: CellAnimationOrigins.OriginType = "center";
    export const STARTING_WEIGHT_KEY: SliceAnimationWeights.WeightType = "diamond_default";
    export const STARTING_ANIMATION_KEY: CellAnimationKeyframes.AnimationType = "zoom_in";
    export const STARTING_GRADIENT_KEY: SVGDefsSamples.Gradient.Timed.SampleKey = "orbit_async_2v1";
    export const STARTING_PATTERN_KEY: SVGDefsSamples.Pattern.Timed.SampleKey = "hexagon_pt_2";
    export const STARTING_WEIGHT_OPTS: WeightOpts = {
        shouldMakeUnique: false,
        shouldNormalize: false,
    };
    export const STARTING_BREAKPOINT_OPTS: SliceAnimationBreakpointOpts = {
        dir: "asc",
        smoothness: 0.25,
        easing: "linear",
    };
    export const STARTING_PLAYBACK_OPTS: SliceAnimationPlaybackOpts = {
        dir: "stack",
        holdMs: 1000,
    };
}
