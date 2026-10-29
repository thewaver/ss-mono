import type { ScanlineAnimationOrientation, SliceAnimationWeights } from "@thewaver/ss-components-svelte";

export type ScanlineAnimationExampleProps = {
    src: string;
    lineCount: number;
    orientation: ScanlineAnimationOrientation;
    weightType: SliceAnimationWeights.OriginFreeWeightType;
    animationDurationMs: number;
    animationIterationDelayMs: number;
    playback: boolean;
    progress?: number;
};
