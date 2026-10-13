export type BaseTypewriterExampleCbs = {
    computeAnimationName: (character: string, index: number, count: number) => string;
    computeCharacterWeights?: (count: number) => number[];
};

export type BaseTypewriterExampleProps = BaseTypewriterExampleCbs;

export type BaseTypewriterComplexExampleValues = {
    width: number;
};

export type BaseTypewriterComplexExampleProps = BaseTypewriterExampleProps & BaseTypewriterComplexExampleValues;

export type BaseTypewriterPhrasesExampleValues = {
    width: number;
};

export type BaseTypewriterPhrasesExampleProps = BaseTypewriterExampleProps & BaseTypewriterPhrasesExampleValues;

export type BaseTypewriterKaraokeExampleValues = {
    width: number;
};

export type BaseTypewriterKaraokeExampleProps = BaseTypewriterKaraokeExampleValues;
