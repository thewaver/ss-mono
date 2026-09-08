import { createRing } from "@thewaver/ss-components";

import type { WheelSpinStyleFn, WheelSpinStyleKey } from "./Wheels.types";

export const MIN_WEDGE_COUNT = 2;
export const MAX_WEDGE_COUNT = 12;
export const WEDGE_COUNT_STEP = 1;
export const MIN_DURATION_MS = 500;
export const MAX_DURATION_MS = 6000;
export const DURATION_STEP_MS = 500;
export const MIN_TURNS = 1;
export const MAX_TURNS = 10;
export const TURNS_STEP = 1;
export const MIN_IDLE_DELAY_MS = 1000;
export const MAX_IDLE_DELAY_MS = 8000;
export const IDLE_DELAY_STEP_MS = 500;
export const FIELD_WIDTH = 130;

export const STARTING_WEDGE_COUNT = 8;
export const STARTING_SPIN_DURATION_MS = 3000;
export const STARTING_SETTLE_DURATION_MS = 1500;
export const STARTING_REST_DURATION_MS = 3000;
export const INDEFINITE_REST_DURATION_MS = -1;
export const STARTING_IDLE_DELAY_MS = 3000;
export const STARTING_TURNS = 3;
export const STARTING_SPIN_STYLE_KEY: WheelSpinStyleKey = "bouncy";

export const PRIZE_FETCH_DELAY_MS = 300;

export const PRIZE_WHEEL_RING = createRing({
    holeRadiusPx: 0,
    bandWidthPx: 50,
    wedgeGapDegrees: 0,
    labelRadiusRatio: 0.8,
    labelHeightRatio: 0.45,
    labelMaxWidthRatio: 1.4,
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
    "A rumour",
    "Another go",
];

export const pickPrizeIndex = (wedgeCount: number) =>
    new Promise<number>((resolve) => {
        setTimeout(() => resolve(Math.floor(Math.random() * wedgeCount)), PRIZE_FETCH_DELAY_MS);
    });
