export type ScrambleTextExampleProps = {
    settleDurationMs: number;
    scrambleIntervalMs: number;
    computeGlyphs?: (character: string) => string;
    computeCharacterWeights?: (count: number) => number[];
};
