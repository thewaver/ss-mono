import type { AccessorProps } from "@thewaver/ss-components-solid";

export type TypewriterTextEffect = "fade" | "scale" | "glow" | "drop" | "slide";

export type TypewriterExampleProps = AccessorProps<{
    computeAnimationName: (character: string, index: number, count: number) => string;
    computeCharacterWeights?: (count: number) => number[];
}>;

export type TypewriterPhrasesExampleProps = TypewriterExampleProps &
    AccessorProps<{
        width: number;
    }>;

export type TypewriterKaraokeExampleProps = AccessorProps<{
    width: number;
}>;
