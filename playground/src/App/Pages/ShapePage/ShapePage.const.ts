import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";

export const EXAMPLE_NAMES = {
    default: "Default",
    morph: "Morph",
    sharedPaint: "Shared Paint",
    textWrap: "Text Wrap",
    fromCss: "From CSS",
    stressTest: "Stress Test",
};

export const CORNER_FIELD_WIDTH = 80;

export const FROM_CSS_FIELD_WIDTH = 660;

export const FROM_CSS_MIN_ROWS = 3;

export const FROM_CSS_MAX_ROWS = 8;

export const MAX_CORNER_COLUMNS = 6;

export const STRESS_ITEMS: (StressTestDefs & { size: number })[] = [
    {
        count: 40,
        colCount: 8,
        gap: 20,
        size: 160,
    },
    {
        count: 160,
        colCount: 16,
        gap: 10,
        size: 80,
    },
    {
        count: 640,
        colCount: 32,
        gap: 5,
        size: 40,
    },
];

export const EXAMPLES_ROOT = "/src/App/Pages/ShapePage/Examples";

export const DEFAULT_EXAMPLE_PATH = `${EXAMPLES_ROOT}/Default.tsx`;

export const WRAPPED_TEXT = [
    "A floated Shape carries its own contour as its float area, so the lines of this paragraph run up to the",
    "edge that is painted rather than to the square box around it. Pick another shape, or round its corners,",
    "and the text follows, because the contour it wraps against is the same one the fill and the stroke are",
    "drawn from. Nothing here measures the shape or writes a polygon by hand: the page floats the element and",
    "sets how far the text keeps clear of it, and that is all. The rest of this paragraph is only here to be",
    "long enough to wrap all the way around, down past the bottom of the shape and back to the full width of",
    "the column, which is where you can see that the float ends where the contour does.",
].join(" ");
