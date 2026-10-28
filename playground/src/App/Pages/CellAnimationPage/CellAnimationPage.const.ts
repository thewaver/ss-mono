import type { Index2d } from "@thewaver/ss-utils";

import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";
import type { CellAnimationSourceKind } from "./CellAnimationPage.types";

export const EXAMPLE_NAMES = {
    source: "A picture, sliced",
    wipe: "A screen wipe",
    stressTest: "Stress Test",
};

export const SOURCE_READOUTS: Record<CellAnimationSourceKind, string> = {
    image: "the progress signal is written by the component while it plays, and writing it moves the pass there",
    gradient:
        "the Shape page's own gradients, serialized into a source — the start and the pause a script would have timed are written into the markup instead, so they run at the same length and rhythm as the cells",
    pattern:
        "the Shape page's own patterns, serialized into a source, which flow on without a pause — a repeating fill has no beat to be out of step with",
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

export const PERCENT = 100;
