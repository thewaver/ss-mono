import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";

export const EXAMPLE_NAMES = {
    glitch: "Glitch",
    surge: "Surge",
    snake: "Snake",
    split: "Split",
    brightness: "Brightness",
    grayscale: "Grayscale",
    hue: "Hue",
    _wave: "_Wave",
    _roll: "_Roll",
    _dropout: "_Dropout",
    _interlace: "_Interlace",
    _skew: "_Skew",
    stressTest: "Stress Test",
};

export const IMAGE_CONTAINER_SIZE = 360;

export const STRESS_LINE_COUNT = 120;

export const STRESS_ITEMS: (StressTestDefs & { size: number; kind: "transform" | "filter" })[] = (
    ["transform", "filter"] as const
)
    .map((kind) => [
        {
            count: 4 * 3,
            cols: 4,
            gap: 10,
            size: STRESS_LINE_COUNT,
            kind,
        },
        {
            count: 6 * 4,
            cols: 6,
            gap: 10,
            size: STRESS_LINE_COUNT,
            kind,
        },
        {
            count: 8 * 6,
            cols: 8,
            gap: 10,
            size: STRESS_LINE_COUNT,
            kind,
        },
        {
            count: 12 * 6,
            cols: 12,
            gap: 10,
            size: STRESS_LINE_COUNT,
            kind,
        },
    ])
    .flat();

export const EXAMPLES_ROOT = "/src/App/Pages/ScanLineAnimationPage/Examples";

export const WEIGHT_ORIGIN = { row: 0, col: 0 };
