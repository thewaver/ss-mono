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

    export const ON_GRAPHICS_CARD_TEXT = {
        label: "On the graphics card",
        hint: "Draws the stress test's cells in one canvas per item, with the keyframes worked out on the graphics card. Off, every cell is an element of its own.",
        controls: "Sets CellAnimationProps.renderer in the stress test",
    };

    export const SOURCE_KIND_TEXT = {
        label: "Source",
        hint: "What the cells are cut from, in the first example and the stress test: a photograph, or one of the Shape page's gradients or patterns drawn into a picture. Choosing one brings its own knobs with it.",
        controls: "Picks the kind of example picture sent to CellAnimationProps.src",
    };

    export const IMAGE_TEXT = {
        label: "Image",
        hint: "Swaps in a picture of your own, so the cells can be watched against something other than the sample.",
        controls: "Picks the example picture sent to CellAnimationProps.src",
    };

    export const GRADIENT_TEXT = {
        label: "Gradient",
        hint: "Which animated gradient is rendered into the picture the cells are cut from.",
        controls: "Picks the gradient drawn into the example picture sent to CellAnimationProps.src",
    };

    export const PATTERN_TEXT = {
        label: "Pattern",
        hint: "Which repeating pattern is rendered into the picture the cells are cut from.",
        controls: "Picks the pattern drawn into the example picture sent to CellAnimationProps.src",
    };

    export const SOURCE_RATIO_TEXT = {
        label: "Ratio",
        hint: "The shape of the picture the gradient or pattern is drawn into, which decides how the cells are proportioned.",
        controls: "Sets the shape of the example picture sent to CellAnimationProps.src",
    };

    export const CELL_COUNT_COLS_TEXT = {
        label: "Cell count (cols x rows)",
        hint: "How many columns and rows the picture is cut into. More cells is a finer animation and more work per frame.",
        controls: "Sets CellAnimationProps.cellCount",
    };

    export const ORIGIN_TYPE_TEXT = {
        label: "Origin",
        hint: "Where in the grid the animation starts from. It only applies to weights that are measured from a point.",
        controls:
            "Picks the point the example's weights are measured from, sent to CellAnimationProps.computeSliceWeights",
    };

    export const WEIGHT_TYPE_TEXT = {
        label: "Weight",
        hint: "How each cell's turn is decided: its distance from the origin, a wave, a random draw, and so on.",
        controls: "Picks the example's weight function sent to CellAnimationProps.computeSliceWeights",
    };

    export const UNIQUE_WEIGHTS_TEXT = {
        label: "Unique weights",
        hint: "Gives every cell a turn of its own, so no two move together even where the weight would have tied them.",
        controls: "Sets WeightOpts.shouldMakeUnique",
    };

    export const NORMALIZE_WEIGHTS_TEXT = {
        label: "Normalize weights",
        hint: "Spreads the weights out to fill the whole run, so the first cell starts at the beginning and the last ends at the end.",
        controls: "Sets WeightOpts.shouldNormalize",
    };

    export const ANIMATION_TYPE_TEXT = {
        label: "Animation",
        hint: "What each cell actually does on its turn: fade, slide, spin, and the rest.",
        controls: "Picks the example's cell keyframes sent to CellAnimationProps.computeSliceAnimation",
    };

    export const DIRECTION_TEXT = {
        label: "Direction",
        hint: "Which way the run travels through the weights, and so which cells go first.",
        controls: "Sets SliceAnimationBreakpointOpts.dir",
    };

    export const EASING_TEXT = {
        label: "Easing",
        hint: "The speed curve a single cell follows from its start to its finish.",
        controls: "Sets SliceAnimationBreakpointOpts.easing",
    };

    export const SMOOTHNESS01_TEXT = {
        label: "Smoothness (0-1)",
        hint: "How much a cell's own movement overlaps its neighbors'. 0 makes each cell wait its turn; 1 blurs them into one sweep.",
        controls: "Sets SliceAnimationBreakpointOpts.smoothness",
    };

    export const ANIMATION_DURATION_MS_TEXT = {
        label: "Animation duration (ms)",
        hint: "How long one pass over the whole grid takes.",
        controls: "Sets CellAnimationProps.animationDurationMs",
    };

    export const ANIMATION_ITERATION_DELAY_MS_TEXT = {
        label: "Iteration delay (ms)",
        hint: "How long the grid waits between one pass and the next.",
        controls: "Sets CellAnimationProps.animationIterationDelayMs",
    };

    export const ANIMATION_ITERATION_COUNT_TEXT = {
        label: "Iteration count (-1 = endless)",
        hint: "How many passes to run. -1 means it never stops, and 0 shows the final frame at once.",
        controls: "Sets CellAnimationProps.animationIterationCount, with -1 sent as Infinity",
    };

    export const FINAL_FRAME_TEXT = {
        label: "Final frame is",
        hint: "What the grid is left showing once the passes are done. It has nothing to settle on while the run is endless.",
        controls: "Sets CellAnimationProps.finalFrame",
    };

    export const PLAYBACK_DIR_TEXT = {
        label: "Playback direction",
        hint: "Whether each pass runs one way, or goes out and comes back. Coming back, stack starts with the last cell to arrive and pipe with the first.",
        controls: "Sets SliceAnimationPlaybackOpts.dir",
    };

    export const HOLD_MS_TEXT = {
        label: "Hold at far end (ms)",
        hint: "How long the grid rests at the far end before turning back. It only applies to stack and pipe, which come back.",
        controls: "Sets SliceAnimationPlaybackOpts.holdMs",
    };
}
