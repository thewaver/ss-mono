import type { PaintedTextStrokeAlignment, SVGDefsSamples } from "@thewaver/ss-components-solid";

import type { PaintKind, PaintSampleKey, PaintSampleKind } from "../PageComponents/PaintPicker/PaintPicker.types";

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
}
