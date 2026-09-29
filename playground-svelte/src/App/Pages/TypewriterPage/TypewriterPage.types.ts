export type TypewriterTextEffect = "fade" | "scale" | "glow" | "drop" | "slide";

export type TypewriterExampleProps = {
    animationName: string;
    computeCharacterWeights?: (count: number) => number[];
};

export type TypewriterPhrasesExampleProps = TypewriterExampleProps & {
    width: number;
};

export type TypewriterExampleWrapperProps = TypewriterExampleProps & {
    width: number;
};
