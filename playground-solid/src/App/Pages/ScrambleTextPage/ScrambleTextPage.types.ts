import type { AccessorProps } from "@thewaver/ss-components-solid";

export type ScrambleTextExampleProps = AccessorProps<{
    settleDurationMs: number;
    scrambleIntervalMs: number;
    computeGlyphs?: (character: string) => string;
    computeCharacterWeights?: (count: number) => number[];
}>;
