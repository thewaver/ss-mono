import type { OdometerReelFn } from "./OdometerReels.types";

const BASE_DURATION_MS = 900;
const STAGGER_MS = 350;
const BASE_TURNS = 1;
const TOGETHER_TURNS = 2;
const TOGETHER_DURATION_MS = 1600;
const SLOW_TURNS = 1;
const FAST_TURNS = 3;
const ALTERNATING_DURATION_MS = 1400;
const LINGER_TURNS = 4;
const LINGER_MS = 1800;
const EVEN = 2;
const HALF = 0.5;

const fromCenter = (digitIndex: number, digitCount: number) => Math.abs(digitIndex - (digitCount - 1) * HALF);

const leftToRight: OdometerReelFn = (digitIndex) => ({
    extraTurns: BASE_TURNS + digitIndex,
    durationMs: BASE_DURATION_MS + digitIndex * STAGGER_MS,
});

const rightToLeft: OdometerReelFn = (digitIndex, digitCount) => ({
    extraTurns: BASE_TURNS + (digitCount - 1 - digitIndex),
    durationMs: BASE_DURATION_MS + (digitCount - 1 - digitIndex) * STAGGER_MS,
});

const together: OdometerReelFn = () => ({
    extraTurns: TOGETHER_TURNS,
    durationMs: TOGETHER_DURATION_MS,
});

const centerOut: OdometerReelFn = (digitIndex, digitCount) => ({
    extraTurns: BASE_TURNS + Math.round(fromCenter(digitIndex, digitCount)),
    durationMs: BASE_DURATION_MS + fromCenter(digitIndex, digitCount) * STAGGER_MS,
});

const outsideIn: OdometerReelFn = (digitIndex, digitCount) => {
    const inward = (digitCount - 1) * HALF - fromCenter(digitIndex, digitCount);

    return {
        extraTurns: BASE_TURNS + Math.round(inward),
        durationMs: BASE_DURATION_MS + inward * STAGGER_MS,
    };
};

const alternating: OdometerReelFn = (digitIndex) => ({
    extraTurns: digitIndex % EVEN === 0 ? SLOW_TURNS : FAST_TURNS,
    durationMs: ALTERNATING_DURATION_MS,
});

const lastLingers: OdometerReelFn = (digitIndex, digitCount) => {
    const isLast = digitIndex === digitCount - 1;

    return {
        extraTurns: BASE_TURNS + digitIndex + (isLast ? LINGER_TURNS : 0),
        durationMs: BASE_DURATION_MS + digitIndex * STAGGER_MS + (isLast ? LINGER_MS : 0),
    };
};

export namespace OdometerReels {
    export const SAMPLE_REELS = {
        leftToRight,
        rightToLeft,
        together,
        centerOut,
        outsideIn,
        alternating,
        lastLingers,
    } satisfies Record<string, OdometerReelFn>;

    export type SampleKey = keyof typeof SAMPLE_REELS;

    export const SAMPLE_KEYS = Object.keys(SAMPLE_REELS) as SampleKey[];
}
