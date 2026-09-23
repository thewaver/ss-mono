import type { AccessorProps } from "@thewaver/ss-components";

export type ScrambleTextExampleProps = AccessorProps<{
    settleDurationMs: number;
    scrambleIntervalMs: number;
    computeGlyphs?: (character: string) => string;
    computeCharacterWeights?: (count: number) => number[];
}>;
