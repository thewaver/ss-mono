import type { CellAnimationWeights, ScanlineAnimationOrientation } from "@thewaver/ss-components-svelte";

export type ScanlineAnimationExampleProps = {
    src: string;
    lineCount: number;
    orientation: ScanlineAnimationOrientation;
    weightType: CellAnimationWeights.OriginFreeWeightType;
    animationDurationMs: number;
    animationIterationDelayMs: number;
    playback: boolean;
};
