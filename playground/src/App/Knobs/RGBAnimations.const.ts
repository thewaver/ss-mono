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
}
