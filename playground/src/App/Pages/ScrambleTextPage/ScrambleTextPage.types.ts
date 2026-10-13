export type BaseScrambleTextExampleValues = {
    settleDurationMs: number;
    scrambleIntervalMs: number;
};

export type BaseScrambleTextExampleCbs = {
    computeGlyphs?: (character: string) => string;
    computeCharacterWeights?: (count: number) => number[];
};

export type BaseScrambleTextExampleProps = BaseScrambleTextExampleValues & BaseScrambleTextExampleCbs;
