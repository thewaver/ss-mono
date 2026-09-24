import type { AccessorProps } from "@thewaver/ss-components";

export type TypewriterTextEffect = "fade" | "scale" | "glow" | "drop" | "slide";

export type TypewriterExampleProps = AccessorProps<{
    animationName: string;
    computeCharacterWeights?: (count: number) => number[];
}>;
