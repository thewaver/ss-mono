import type { AccessorProps } from "@thewaver/ss-components-solid";

export type TypewriterTextEffect = "fade" | "scale" | "glow" | "drop" | "slide";

export type TypewriterExampleProps = AccessorProps<{
    animationName: string;
    computeCharacterWeights?: (count: number) => number[];
}>;

export type TypewriterPhrasesExampleProps = TypewriterExampleProps &
    AccessorProps<{
        width: number;
    }>;
