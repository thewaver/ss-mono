import type { CellAnimationBreakpointOpts, CellAnimationWeights } from "@thewaver/ss-components";

export namespace ScanlineAnimationKnobs {
    export const MIN_GLITCH_COUNT = 1;
    export const MAX_GLITCH_COUNT = 10;
    export const GLITCH_COUNT_STEP = 1;
    export const MIN_SMOOTHNESS = 0.1;
    export const MAX_SMOOTHNESS = 1;
    export const SMOOTHNESS_STEP = 0.1;
    export const MIN_SHIFT_PERCENT = 5;
    export const MAX_SHIFT_PERCENT = 25;
    export const SHIFT_PERCENT_STEP = 5;
    export const MIN_CHUNKYNESS = 0.1;
    export const MAX_CHUNKYNESS = 1;
    export const CHUNKYNESS_STEP = 0.1;
    export const MIN_LINE_COUNT = 8;
    export const MAX_LINE_COUNT = 240;
    export const LINE_COUNT_STEP = 4;
    export const MIN_DURATION_MS = 100;
    export const MAX_DURATION_MS = 5000;
    export const DURATION_STEP_MS = 100;
    export const MIN_ITERATION_DELAY_MS = 0;

    export const STARTING_LINE_COUNT = 120;
    export const STARTING_DURATION_MS = 2000;
    export const STARTING_ITERATION_DELAY_MS = 1000;
    export const STARTING_WEIGHT_TYPE: CellAnimationWeights.OriginFreeWeightType = "sequenceLinear";
    export const STARTING_GLITCH_OPTS = { count: 3, shiftPercent: 10, chunkyness: 0.8 };
    export const STARTING_SURGE_BREAKPOINT_OPTS: CellAnimationBreakpointOpts = { dir: "asc", smoothness: 0.2 };
    export const STARTING_SNAKE_BREAKPOINT_OPTS: CellAnimationBreakpointOpts = { dir: "asc", smoothness: 0.2 };
    export const STARTING_SPLIT_BREAKPOINT_OPTS: CellAnimationBreakpointOpts = { dir: "asc", smoothness: 1 };
    export const STARTING_BRIGHTNESS_BREAKPOINT_OPTS: CellAnimationBreakpointOpts = { dir: "asc", smoothness: 0.5 };
    export const STARTING_GRAYSCALE_BREAKPOINT_OPTS: CellAnimationBreakpointOpts = { dir: "asc", smoothness: 0.5 };
    export const STARTING_HUE_BREAKPOINT_OPTS: CellAnimationBreakpointOpts = { dir: "asc", smoothness: 0.5 };
    export const STARTING_WAVE_BREAKPOINT_OPTS: CellAnimationBreakpointOpts = { dir: "asc", smoothness: 0.6 };
    export const STARTING_ROLL_BREAKPOINT_OPTS: CellAnimationBreakpointOpts = { dir: "asc", smoothness: 0.1 };
    export const STARTING_DROPOUT_BREAKPOINT_OPTS: CellAnimationBreakpointOpts = { dir: "asc", smoothness: 0.2 };
    export const STARTING_INTERLACE_BREAKPOINT_OPTS: CellAnimationBreakpointOpts = { dir: "asc", smoothness: 0.8 };
    export const STARTING_SKEW_BREAKPOINT_OPTS: CellAnimationBreakpointOpts = { dir: "asc", smoothness: 0.3 };
}
