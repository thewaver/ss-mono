import type { ScrambleTextWeightFn } from "./ScrambleTextWeights.types";

const GOLDEN_RATIO_CONJUGATE = 0.618033988749895;
const SINGLE_CHARACTER = 1;
const HALF = 0.5;
const FULL_WEIGHT = 1;

const rightToLeft: ScrambleTextWeightFn = (count) =>
    Array.from(
        { length: count },
        (_unused, index) => FULL_WEIGHT - index / Math.max(count - SINGLE_CHARACTER, SINGLE_CHARACTER),
    );

const fromMiddle: ScrambleTextWeightFn = (count) => {
    const middle = (count - SINGLE_CHARACTER) * HALF;

    return Array.from(
        { length: count },
        (_unused, index) => Math.abs(index - middle) / Math.max(middle, SINGLE_CHARACTER),
    );
};

const scattered: ScrambleTextWeightFn = (count) =>
    Array.from({ length: count }, (_unused, index) => (index * GOLDEN_RATIO_CONJUGATE) % FULL_WEIGHT);

export namespace ScrambleTextWeights {
    export const SAMPLE_WEIGHTS = {
        rightToLeft,
        fromMiddle,
        scattered,
    } satisfies Record<string, ScrambleTextWeightFn>;

    export type SampleKey = keyof typeof SAMPLE_WEIGHTS;

    export const SAMPLE_KEYS = Object.keys(SAMPLE_WEIGHTS) as SampleKey[];
}
