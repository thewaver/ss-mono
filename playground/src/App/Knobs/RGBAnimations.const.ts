import { SVGFilterDefs } from "@thewaver/ss-components";

import type { RGBAnimationSourceKey } from "../Pages/RGBAnimationPage/RGBAnimationPage.types";

export namespace RGBAnimationKnobs {
    export const MIN_DURATION_MS = 100;
    export const MAX_DURATION_MS = 5000;
    export const DURATION_STEP_MS = 100;
    export const MIN_ITERATION_DELAY_MS = 0;
    export const MAX_ITERATION_DELAY_MS = 5000;
    export const STARTING_SOURCE: RGBAnimationSourceKey = "knight";

    export const MIN_GLITCH_COUNT = 1;
    export const MAX_GLITCH_COUNT = 10;
    export const GLITCH_COUNT_STEP = 1;
    export const MIN_SHIFT_PERCENT = 1;
    export const MAX_SHIFT_PERCENT = 20;
    export const SHIFT_PERCENT_STEP = 1;
    export const STARTING_GLITCH_OPTS = { count: 3, shiftPercent: 5 };

    export const MIN_SCALE_PERCENT = 0;
    export const MAX_SCALE_PERCENT = 30;
    export const SCALE_PERCENT_STEP = 1;
    export const STARTING_SCALE_PERCENT = 10;

    export const MIN_ORBIT_RADIUS_PERCENT = 0;
    export const MAX_ORBIT_RADIUS_PERCENT = 10;
    export const ORBIT_RADIUS_STEP_PERCENT = 0.5;
    export const STARTING_ORBIT_RADIUS_PERCENT = 2;

    export const MIN_FOCUS_BLUR_PX = 0;
    export const MAX_FOCUS_BLUR_PX = 10;
    export const FOCUS_BLUR_STEP_PX = 1;
    export const STARTING_FOCUS_BLUR_PX = 4;

    export const MIN_TWIST_DEGREES = 0;
    export const MAX_TWIST_DEGREES = 20;
    export const TWIST_STEP_DEGREES = 1;
    export const STARTING_TWIST_DEGREES = 4;

    export const MIN_HUE_TURNS = 1;
    export const MAX_HUE_TURNS = 3;
    export const HUE_TURNS_STEP = 1;
    export const STARTING_HUE_TURNS = 1;

    export const MIN_TILT_DEGREES = 0;
    export const MAX_TILT_DEGREES = 45;
    export const TILT_STEP_DEGREES = 5;
    export const STARTING_TILT_DEGREES = 20;

    export const MIN_ANAGLYPH_SEPARATION_PERCENT = 0;
    export const MAX_ANAGLYPH_SEPARATION_PERCENT = 10;
    export const ANAGLYPH_SEPARATION_STEP_PERCENT = 0.5;
    export const STARTING_ANAGLYPH_SEPARATION_PERCENT = 3;

    export const MIN_ECHO_DISTANCE_PERCENT = 0;
    export const MAX_ECHO_DISTANCE_PERCENT = 10;
    export const ECHO_DISTANCE_STEP_PERCENT = 0.5;
    export const STARTING_ECHO_DISTANCE_PERCENT = 4;

    export const FROM_COLOR_SCHEME = "from color-scheme";
    export const COLOR_MIXING_CHOICES = [FROM_COLOR_SCHEME, ...SVGFilterDefs.COLOR_MIXINGS] as const;

    export const GLITCH_COUNT_TEXT = {
        label: "Glitches per pass",
        hint: "How many tears follow each other in the middle of a pass. Each one shifts every channel its own way.",
        controls: "Sets the example's glitch count, read by its RGBAnimationProps.computeSliceAnimation",
    };

    export const SHIFT_PERCENT_TEXT = {
        label: "Shift (%)",
        hint: "The furthest a channel moves in a tear, as a share of the picture's size.",
        controls: "Sets the example's shift, read by its RGBAnimationProps.computeSliceAnimation",
    };

    export const SCALE_PERCENT_TEXT = {
        label: "Scale (%)",
        hint: "How far red grows and blue shrinks at the top of the swell. Green stays put.",
        controls: "Sets the example's scale, read by its RGBAnimationProps.computeSliceAnimation",
    };

    export const RADIUS_PERCENT_TEXT = {
        label: "Radius (%)",
        hint: "How far the channels circle from their resting place at the widest point of the pass, as a share of the picture's size.",
        controls: "Sets the example's radius, read by its RGBAnimationProps.computeSliceAnimation",
    };

    export const MAX_BLUR_PX_TEXT = {
        label: "Blur (px)",
        hint: "How soft each channel goes at the worst of its turn out of focus.",
        controls: "Sets the example's blur, read by its RGBAnimationProps.computeSliceAnimation",
    };

    export const ANGLE_TEXT = {
        label: "Angle (°)",
        hint: "How far red and blue turn, in opposite directions, at the middle of the pass. Green stays put.",
        controls: "Sets the example's angle, read by its RGBAnimationProps.computeSliceAnimation",
    };

    export const TURNS_TEXT = {
        label: "Turns",
        hint: "How many times the two turning channels go round the color wheel, in opposite directions, over one pass. The third stays put, a different one each pass.",
        controls: "Sets the example's turns, read by its RGBAnimationProps.computeSliceAnimation",
    };

    export const ANGLE_2_TEXT = {
        label: "Angle (°)",
        hint: "How far red and blue swing in depth, in opposite directions. Green stays put.",
        controls: "Sets the example's angle, read by its RGBAnimationProps.computeSliceAnimation",
    };

    export const SEPARATION_PERCENT_TEXT = {
        label: "Separation (%)",
        hint: "How far red moves left and blue moves right at the middle of the pass, as a share of the picture's width. Green stays put.",
        controls: "Sets the example's separation, read by its RGBAnimationProps.computeSliceAnimation",
    };

    export const DISTANCE_PERCENT_TEXT = {
        label: "Distance (%)",
        hint: "How far the picture drifts along its figure-eight, as a share of its size. Green and blue follow a little later than red.",
        controls:
            "Sets the example's distance, read by its RGBAnimationProps.computeRootAnimation and computeSliceAnimation",
    };

    export const ON_GRAPHICS_CARD_TEXT = {
        label: "On the graphics card",
        hint: "Draws the stress test's channels in one canvas per item, with the keyframes worked out on the graphics card. Off, every channel is an element of its own.",
        controls: "Sets RGBAnimationProps.renderer in the stress test",
    };

    export const SOURCE_TEXT = {
        label: "Source",
        hint: "The picture the channels are split from: the knight photograph, or a line of SVG text.",
        controls: "Picks the example picture sent to RGBAnimationProps.src",
    };

    export const ANIMATION_DURATION_MS_TEXT = {
        label: "Animation duration (ms)",
        hint: "How long one pass takes.",
        controls: "Sets RGBAnimationProps.animationDurationMs",
    };

    export const ANIMATION_ITERATION_DELAY_MS_TEXT = {
        label: "Iteration delay (ms)",
        hint: "How long the picture waits between one pass and the next.",
        controls: "Sets RGBAnimationProps.animationIterationDelayMs",
    };

    export const COLOR_MIXING_TEXT = {
        label: "Color mixing",
        hint: "How the channels are put back together. Additive fringes are red, green and blue and read on a dark ground; subtractive ones are cyan, magenta and yellow and read on a light one. Left out, it follows the page's color-scheme at the start of each pass.",
        controls: "Sets RGBAnimationProps.colorMixing, with the color-scheme choice sent as undefined",
    };
}
