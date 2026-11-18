import type { SliceAnimationBreakpointOpts, SliceAnimationWeights } from "@thewaver/ss-components";

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
    export const STARTING_WEIGHT_TYPE: SliceAnimationWeights.OriginFreeWeightType = "sequence_linear";
    export const STARTING_GLITCH_OPTS = { count: 3, shiftPercent: 10, chunkyness: 0.8 };
    export const STARTING_SURGE_BREAKPOINT_OPTS: SliceAnimationBreakpointOpts = { dir: "asc", smoothness: 0.2 };
    export const STARTING_SNAKE_BREAKPOINT_OPTS: SliceAnimationBreakpointOpts = { dir: "asc", smoothness: 0.2 };
    export const STARTING_SPLIT_BREAKPOINT_OPTS: SliceAnimationBreakpointOpts = { dir: "asc", smoothness: 1 };
    export const STARTING_BRIGHTNESS_BREAKPOINT_OPTS: SliceAnimationBreakpointOpts = { dir: "asc", smoothness: 0.5 };
    export const STARTING_GRAYSCALE_BREAKPOINT_OPTS: SliceAnimationBreakpointOpts = { dir: "asc", smoothness: 0.5 };
    export const STARTING_HUE_BREAKPOINT_OPTS: SliceAnimationBreakpointOpts = { dir: "asc", smoothness: 0.5 };
    export const STARTING_DROPOUT_BREAKPOINT_OPTS: SliceAnimationBreakpointOpts = { dir: "asc", smoothness: 0.2 };
    export const STARTING_INTERLACE_BREAKPOINT_OPTS: SliceAnimationBreakpointOpts = { dir: "asc", smoothness: 0.8 };

    export const ON_GRAPHICS_CARD_TEXT = {
        label: "On the graphics card",
        hint: "Draws the stress test's lines in one canvas per item, with the keyframes worked out on the graphics card. Off, every line is an element of its own.",
        controls: "Sets ScanlineAnimationProps.renderer in the stress test",
    };

    export const SMOOTHNESS01_TEXT = {
        label: "Smoothness (0-1)",
        hint: "How much one line's movement overlaps its neighbors'. 0 makes each line wait its turn; 1 blurs them into one sweep.",
        controls: "Sets SliceAnimationBreakpointOpts.smoothness",
    };

    export const DIRECTION_TEXT = {
        label: "Direction",
        hint: "Which way the sweep travels through the lines, and so which lines go first.",
        controls: "Sets SliceAnimationBreakpointOpts.dir",
    };

    export const COUNT_TEXT = {
        label: "Count",
        hint: "How many glitch bursts happen over one pass.",
        controls: "Sets the number of glitch bursts in the example's ScanlineAnimationProps.computeSliceAnimation",
    };

    export const MAX_SHIFT_TEXT = {
        label: "Max shift (%)",
        hint: "How far a line can be thrown sideways at the worst of a burst, as a share of its own width.",
        controls: "Sets how far rows slide in the example's ScanlineAnimationProps.computeSliceAnimation",
    };

    export const CHUNKYNESS01_TEXT = {
        label: "Chunkyness (0-1)",
        hint: "How blocky the glitch is: low values throw single lines about, high values throw thick slabs.",
        controls:
            "Sets how many neighboring rows slide together in the example's ScanlineAnimationProps.computeSliceAnimation",
    };

    export const IMAGE_TEXT = {
        label: "Image",
        hint: "Swaps in a picture of your own, so the sweep can be watched against something other than the sample.",
        controls: "Picks the example picture sent to ScanlineAnimationProps.src",
    };

    export const WEIGHT_TYPE_TEXT = {
        label: "Weight",
        hint: "How each line's turn is decided: its position, a wave, a random draw, and so on.",
        controls: "Picks the example's weight function sent to ScanlineAnimationProps.computeSliceWeights",
    };

    export const LINE_COUNT_TEXT = {
        label: "Line count",
        hint: "How many lines the picture is cut into. More lines is a finer sweep and more work per frame.",
        controls: "Sets ScanlineAnimationProps.lineCount",
    };

    export const ORIENTATION_TEXT = {
        label: "Orientation",
        hint: "Which way the lines run: rows across the picture, or columns down it. The samples here were written for rows, so on columns they still push sideways and some read their place off the row.",
        controls: "Sets ScanlineAnimationProps.orientation",
    };

    export const ANIMATION_DURATION_MS_TEXT = {
        label: "Animation duration (ms)",
        hint: "How long one sweep over the whole picture takes.",
        controls: "Sets ScanlineAnimationProps.animationDurationMs",
    };

    export const ANIMATION_ITERATION_DELAY_MS_TEXT = {
        label: "Iteration delay (ms)",
        hint: "How long the picture waits between one sweep and the next.",
        controls: "Sets ScanlineAnimationProps.animationIterationDelayMs",
    };
}
