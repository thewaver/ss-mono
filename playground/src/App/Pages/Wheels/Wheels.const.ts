import { PlacementLayoutUtils } from "@thewaver/ss-components";

import type { WheelSpinStyleFn, WheelSpinStyleKey } from "./Wheels.types";

export const FIELD_WIDTH = 130;

export const INDEFINITE_REST_DURATION_MS = -1;

export const PRIZE_FETCH_DELAY_MS = 300;

export const PRIZE_WHEEL_RING = PlacementLayoutUtils.createRing({
    holeRatio: 0,
    wedgeGapDegrees: 0,
    itemRadiusRatio: 0.8,
    itemHeightRatio: 0.45,
    itemMaxWidthRatio: 1.4,
});

const MIN_LIVELY_TURNS = 1;
const LIVELY_JITTER_SPREAD = 0.9;

const rigid: WheelSpinStyleFn = (index, wedgeCount, turns) => ({ turns, jitterRatio: 0 });

const bouncy: WheelSpinStyleFn = (index, wedgeCount, turns) => ({
    turns: MIN_LIVELY_TURNS + Math.floor(Math.random() * (turns - MIN_LIVELY_TURNS + 1)),
    jitterRatio: (Math.random() - 0.5) * LIVELY_JITTER_SPREAD,
});

export const SPIN_STYLES: Record<WheelSpinStyleKey, WheelSpinStyleFn> = { rigid, bouncy };

export const SPIN_STYLE_KEYS = Object.keys(SPIN_STYLES) as WheelSpinStyleKey[];

export const PRIZES = [
    "Free spin",
    "Ten coins",
    "Nothing",
    "A hat",
    "Fifty coins",
    "A shrug",
    "Two hats",
    "Jackpot",
    "A sticker",
    "Half a coin",
    "A rumor",
    "Another go",
];

export const pickPrizeIndex = (wedgeCount: number) =>
    new Promise<number>((resolve) => {
        setTimeout(() => resolve(Math.floor(Math.random() * wedgeCount)), PRIZE_FETCH_DELAY_MS);
    });
