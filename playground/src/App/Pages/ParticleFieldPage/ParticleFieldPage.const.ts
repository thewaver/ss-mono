import {
    SLICE_STOP_KEYS,
    type SliceAnimationFn,
    SliceAnimationKeyframeUtils,
    type SliceStop,
} from "@thewaver/ss-components";
import { type Index2d, type Point2d, type Rect, RectUtils } from "@thewaver/ss-utils";

import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";

const composeEnvelope = (stops: SliceStop[], holdShare: number): SliceStop[] => {
    const edge = (1 - holdShare) * 0.5;

    return SLICE_STOP_KEYS.flatMap((key) => {
        const track = stops.filter((stop) => stop[key] !== undefined);

        if (track.length === 0) return [];
        if (edge <= 0) return [{ at: 0, [key]: track[track.length - 1][key] }];

        return [
            ...track.map((stop) => ({ at: stop.at * edge, [key]: stop[key] })),
            ...[...track].reverse().map((stop) => ({ at: 1 - stop.at * edge, [key]: stop[key] })),
        ];
    });
};

export const createEnvelope = (animation: SliceAnimationFn, holdShare: number) => {
    const composed = new WeakMap<SliceStop[], SliceStop[]>();

    return SliceAnimationKeyframeUtils.fromSlices((defs) => {
        const stops = SliceAnimationKeyframeUtils.resolveStops(animation, defs) ?? [];
        const existing = composed.get(stops);

        if (existing) return existing;

        const next = composeEnvelope(stops, holdShare);

        composed.set(stops, next);

        return next;
    });
};

export const computeParticlePos = (rect: Rect, isScattered: boolean): Point2d =>
    isScattered
        ? { x: rect.x + Math.random() * rect.width, y: rect.y + Math.random() * rect.height }
        : RectUtils.getCenter(rect);

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
