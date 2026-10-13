import type { Index2d } from "@thewaver/ss-utils";

import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";

export const EXAMPLE_NAMES = {
    image: "A photograph, sliced",
    gradient: "A gradient, drawn in place",
    pattern: "A pattern, drawn in place",
    wipe: "A screen wipe",
    stressTest: "Stress Test",
};

export const IMAGE_CONTAINER_SIZE = 480;

export const STRESS_CELL_COUNT: Index2d = { row: 11, col: 11 };

export const STRESS_ITEM_SIZE = 120;

export const STRESS_ITEMS: (StressTestDefs & { size: number })[] = [
    {
        count: 4 * 3,
        cols: 4,
        gap: 10,
        size: STRESS_ITEM_SIZE,
    },
    {
        count: 6 * 4,
        cols: 6,
        gap: 10,
        size: STRESS_ITEM_SIZE,
    },
    {
        count: 8 * 6,
        cols: 8,
        gap: 10,
        size: STRESS_ITEM_SIZE,
    },
    {
        count: 12 * 6,
        cols: 12,
        gap: 10,
        size: STRESS_ITEM_SIZE,
    },
];

export const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/CellAnimationPage/Examples/Default.tsx";

export const WIPE_EXAMPLE_PATH = "/src/App/Pages/CellAnimationPage/Examples/Wipe.tsx";

export const DRAWN_SOURCE_PATH = "/src/App/PageComponents/SVGDefsSources/SVGDefsSources.const.ts";

export const PERCENT = 100;
