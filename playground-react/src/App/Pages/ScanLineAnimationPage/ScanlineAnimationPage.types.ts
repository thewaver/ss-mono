import type { ScanlineAnimationOrientation, SliceAnimationWeights } from "@thewaver/ss-components-react";

export type ScanlineAnimationExampleProps = {
    src: string;
    lineCount: number;
    orientation: ScanlineAnimationOrientation;
    weightType: SliceAnimationWeights.OriginFreeWeightType;
    animationDurationMs: number;
    animationIterationDelayMs: number;
    playback: readonly [boolean, (isPlaying: boolean) => void];
    progress?: readonly [number, (progress: number) => void];
};
