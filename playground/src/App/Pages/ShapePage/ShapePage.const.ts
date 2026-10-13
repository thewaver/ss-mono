import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";

export const EXAMPLE_NAMES = {
    default: "Default",
    morph: "Morph",
    sharedPaint: "Shared Paint",
    textWrap: "Text Wrap",
    stressTest: "Stress Test",
};

export const CORNER_FIELD_WIDTH = 80;

export const MAX_CORNER_COLUMNS = 6;

export const STRESS_ITEMS: (StressTestDefs & { size: number })[] = [
    {
        count: 40,
        cols: 8,
        gap: 20,
        size: 160,
    },
    {
        count: 160,
        cols: 16,
        gap: 10,
        size: 80,
    },
    {
        count: 640,
        cols: 32,
        gap: 5,
        size: 40,
    },
];

export const EXAMPLES_ROOT = "/src/App/Pages/ShapePage/Examples";

export const DEFAULT_EXAMPLE_PATH = `${EXAMPLES_ROOT}/Default.tsx`;
