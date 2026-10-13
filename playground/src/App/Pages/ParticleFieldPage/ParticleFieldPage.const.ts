import { ParticleFieldUtils } from "@thewaver/ss-components";
import type { Index2d, Point2d, Rect } from "@thewaver/ss-utils";

import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";

export const computeParticleTimeline = (t: number, holdShare: number) => {
    const edge = (1 - holdShare) * 0.5;

    if (edge <= 0) return 1;

    if (t < edge) return t / edge;

    if (t > 1 - edge) return (1 - t) / edge;

    return 1;
};

export const computeParticlePos = (rect: Rect, isScattered: boolean): Point2d =>
    isScattered
        ? { x: rect.x + Math.random() * rect.width, y: rect.y + Math.random() * rect.height }
        : ParticleFieldUtils.toCenter(rect);

export const EXAMPLE_NAMES = {
    default: "The whole box",
    shaped: "Inside a shape",
    stressTest: "Stress Test",
};

export const EXAMPLES_ROOT = "/src/App/Pages/ParticleFieldPage/Examples";

export const BOX_WIDTH = 320;

export const BOX_HEIGHT = 320;

export const SHAPED_BOX_SIZE = 320;

export const PERCENT = 100;

export const STRESS_CELL_COUNT: Index2d = { col: 11, row: 11 };

export const STRESS_ITEM_SIZE = 120;

export const STRESS_ITEMS: (StressTestDefs & { size: number })[] = [
    { count: 4 * 3, cols: 4, gap: 10, size: STRESS_ITEM_SIZE },
    { count: 6 * 4, cols: 6, gap: 10, size: STRESS_ITEM_SIZE },
    { count: 8 * 6, cols: 8, gap: 10, size: STRESS_ITEM_SIZE },
    { count: 12 * 6, cols: 12, gap: 10, size: STRESS_ITEM_SIZE },
];
