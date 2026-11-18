import type { PaintedTextStrokeAlignment, SVGDefsSamples } from "@thewaver/ss-components";

import type { PaintKind, PaintSampleKey, PaintSampleKind } from "../PageComponents/PaintPicker/PaintKind.types";

export namespace PaintedTextKnobs {
    export const STROKE_ALIGNMENTS: PaintedTextStrokeAlignment[] = ["outside", "center", "inside"];

    export const MIN_STROKE_WIDTH = 0;
    export const MAX_STROKE_WIDTH = 16;
    export const STROKE_WIDTH_STEP = 1;
    export const MIN_CONTAINER_WIDTH = 120;
    export const MAX_CONTAINER_WIDTH = 960;
    export const CONTAINER_WIDTH_STEP = 10;
    export const MIN_BLUR_WIDTH = 0;
    export const MAX_BLUR_WIDTH = 40;
    export const BLUR_WIDTH_STEP = 1;
    export const MIN_DURATION_MS = 1000;
    export const MAX_DURATION_MS = 5000;
    export const DURATION_STEP_MS = 100;
    export const MIN_CELL_SIZE = 10;
    export const MAX_CELL_SIZE = 160;
    export const CELL_SIZE_STEP = 2;
    export const MIN_FONT_SIZE = 12;
    export const MAX_FONT_SIZE = 200;
    export const FONT_SIZE_STEP = 2;
    export const MIN_LINE_HEIGHT = 0.8;
    export const MAX_LINE_HEIGHT = 3;
    export const LINE_HEIGHT_STEP = 0.1;
    export const MIN_FONT_WEIGHT = 100;
    export const MAX_FONT_WEIGHT = 900;
    export const FONT_WEIGHT_STEP = 100;
    export const CUSTOM_TEXT_WIDTH = 320;
    export const CUSTOM_TEXT_MIN_ROWS = 4;
    export const CUSTOM_TEXT_MAX_ROWS = 10;
    export const MIN_LAP_DURATION_MS = 2000;
    export const MAX_LAP_DURATION_MS = 30000;
    export const LAP_DURATION_STEP_MS = 500;
    export const MIN_CIRCLE_RADIUS = 40;
    export const MAX_CIRCLE_RADIUS = 200;
    export const CIRCLE_RADIUS_STEP = 5;

    export const STARTING_WIDTH = 560;
    export const STARTING_FILL_PAINT_KIND: PaintKind = "timed";
    export const STARTING_STROKE_PAINT_KIND: PaintKind = "solid";
    export const STARTING_KEYS: Partial<Record<PaintSampleKind, PaintSampleKey>> = { timed: "flow_diag_3" };
    export const STARTING_BLUR_WIDTH = 0;
    export const STARTING_DURATION_MS = 2000;
    export const STARTING_CELL_SIZE = 24;
    export const STARTING_FONT_SIZE = 80;
    export const STARTING_LINE_HEIGHT = 1;
    export const STARTING_FONT_WEIGHT = 700;
    export const STARTING_ARRIVAL_EFFECT = "scale";
    export const STARTING_CUSTOM_TEXT = "Type here,\n\nand the paint follows.";
    export const STARTING_CIRCLE_RADIUS = 90;
    export const STARTING_IS_FITTED_TO_PATH = true;
    export const STARTING_ITERATION_KEY: SVGDefsSamples.Iteration.SampleKey = "constant";

    export const FONT_SIZE_TEXT = {
        label: "Font size (px)",
        hint: "How large the letters are.",
        controls: "Sets the font size of the example text sent as PaintedText's children",
    };

    export const LINE_HEIGHT_TEXT = {
        label: "Line height",
        hint: "How tall each line is, as a multiple of the font size, which decides how far apart the lines sit.",
        controls: "Sets the line height of the example text sent as PaintedText's children",
    };

    export const FONT_WEIGHT_TEXT = {
        label: "Font weight",
        hint: "How heavy the letters are, from 100 to 900.",
        controls: "Sets the font weight of the example text sent as PaintedText's children",
    };

    export const ARRIVAL_EFFECT_TEXT = {
        label: "Arrival effect",
        hint: "How each letter arrives. The keyframes are the Typewriter page's own, played by the painted letters.",
        controls: "Picks the example keyframes sent to TypewriterProps.computeAnimationName",
    };

    export const LAP_DURATION_MS_TEXT = {
        label: "Lap duration (ms)",
        hint: "How long the text takes to slide once round the whole length of its path.",
        controls: "Sets PaintedTextProps.lapDurationMs",
    };

    export const RADIUS_TEXT = {
        label: "Radius (px)",
        hint: "How far the circle the text runs round is from its center.",
        controls: "Sets the radius of the example circle sent to PaintedTextProps.path",
    };

    export const IS_FITTED_TO_PATH_TEXT = {
        label: "Fit to the circle",
        hint: "Stretches or squeezes the spacing between the letters so the text goes round the circle exactly once, meeting its own start.",
        controls: "Sets PaintedTextProps.isFittedToPath",
    };

    export const STROKE_WIDTH_TEXT = {
        label: "Stroke width (px)",
        hint: "How wide the stroke appears, whichever side of the letter's edge it sits on.",
        controls: "Sets PaintedTextProps.strokeWidth",
    };

    export const STROKE_ALIGNMENT_TEXT = {
        label: "Stroke alignment",
        hint: "Where the stroke sits against the edge of each letter: outside keeps the letters their full shape, inside keeps the text its overall size, and center straddles the edge.",
        controls: "Sets PaintedTextProps.strokeAlignment",
    };

    export const COLORS_TEXT = {
        label: "Colors",
        hint: "The colors the fill and the stroke are built from. Each sample uses as many as it needs.",
        controls:
            "Sets the colors of the example paints sent to PaintedTextProps.computeFillDefs and PaintedTextProps.computeStrokeDefs",
    };

    export const BLUR_WIDTH_TEXT = {
        label: "Blur (px)",
        hint: "How far the paint is blurred outward, which is what gives it its glow.",
        controls:
            "Sets the blur of the example paints sent to PaintedTextProps.computeFillDefs and PaintedTextProps.computeStrokeDefs",
    };

    export const ANIMATION_DURATION_MS_TEXT = {
        label: "Animation duration (ms)",
        hint: "How long one pass of the fill or stroke animation takes.",
        controls:
            "Sets the duration of the example paints sent to PaintedTextProps.computeFillDefs and PaintedTextProps.computeStrokeDefs",
    };

    export const ITERATION_CONFIG_KEY_TEXT = {
        label: "Iteration Pattern",
        hint: "How the animation repeats: once, endlessly, or back and forth.",
        controls:
            "Picks how the example paints repeat, sent to PaintedTextProps.computeFillDefs and PaintedTextProps.computeStrokeDefs",
    };

    export const CELL_SIZE_TEXT = {
        label: "Pattern Cell Size (px)",
        hint: "How large one tile of a pattern is before it repeats.",
        controls:
            "Sets the tile size of the example paints sent to PaintedTextProps.computeFillDefs and PaintedTextProps.computeStrokeDefs",
    };
}
