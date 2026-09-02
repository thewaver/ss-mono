import type { AccessorProps } from "@thewaver/ss-components";

export type ScrambleTextExampleProps = AccessorProps<{
    glyphs: string | undefined;
    settleDurationMs: number;
    scrambleIntervalMs: number;
    computeCharacterWeights?: (count: number) => number[];
}>;
