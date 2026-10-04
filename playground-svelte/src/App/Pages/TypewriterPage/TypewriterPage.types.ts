export type TypewriterTextEffect = "fade" | "scale" | "glow" | "drop" | "slide";

export type TypewriterExampleProps = {
    computeAnimationName: (character: string, index: number, count: number) => string;
    computeCharacterWeights?: (count: number) => number[];
};

export type TypewriterPhrasesExampleProps = TypewriterExampleProps & {
    width: number;
};

export type TypewriterExampleWrapperProps = TypewriterExampleProps & {
    width: number;
};
