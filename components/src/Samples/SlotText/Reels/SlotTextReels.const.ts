import type { SlotTextReelFn } from "./SlotTextReels.types";

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

const fromCenter = (wheelIndex: number, wheelCount: number) => Math.abs(wheelIndex - (wheelCount - 1) * HALF);

const leftToRight: SlotTextReelFn = (wheelIndex) => ({
    extraTurns: BASE_TURNS + wheelIndex,
    durationMs: BASE_DURATION_MS + wheelIndex * STAGGER_MS,
});

const rightToLeft: SlotTextReelFn = (wheelIndex, wheelCount) => ({
    extraTurns: BASE_TURNS + (wheelCount - 1 - wheelIndex),
    durationMs: BASE_DURATION_MS + (wheelCount - 1 - wheelIndex) * STAGGER_MS,
});

const together: SlotTextReelFn = () => ({
    extraTurns: TOGETHER_TURNS,
    durationMs: TOGETHER_DURATION_MS,
});

const centerOut: SlotTextReelFn = (wheelIndex, wheelCount) => ({
    extraTurns: BASE_TURNS + Math.round(fromCenter(wheelIndex, wheelCount)),
    durationMs: BASE_DURATION_MS + fromCenter(wheelIndex, wheelCount) * STAGGER_MS,
});

const outsideIn: SlotTextReelFn = (wheelIndex, wheelCount) => {
    const inward = (wheelCount - 1) * HALF - fromCenter(wheelIndex, wheelCount);

    return {
        extraTurns: BASE_TURNS + Math.round(inward),
        durationMs: BASE_DURATION_MS + inward * STAGGER_MS,
    };
};

const alternating: SlotTextReelFn = (wheelIndex) => ({
    extraTurns: wheelIndex % EVEN === 0 ? SLOW_TURNS : FAST_TURNS,
    durationMs: ALTERNATING_DURATION_MS,
});

const lastLingers: SlotTextReelFn = (wheelIndex, wheelCount) => {
    const isLast = wheelIndex === wheelCount - 1;

    return {
        extraTurns: BASE_TURNS + wheelIndex + (isLast ? LINGER_TURNS : 0),
        durationMs: BASE_DURATION_MS + wheelIndex * STAGGER_MS + (isLast ? LINGER_MS : 0),
    };
};

export namespace SlotTextReels {
    export const SAMPLE_REELS = {
        left_to_right: leftToRight,
        right_to_left: rightToLeft,
        together,
        center_out: centerOut,
        outside_in: outsideIn,
        alternating,
        last_lingers: lastLingers,
    } satisfies Record<string, SlotTextReelFn>;

    export type SampleKey = keyof typeof SAMPLE_REELS;

    export const SAMPLE_KEYS = Object.keys(SAMPLE_REELS) as SampleKey[];
}
