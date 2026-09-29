import type { CellAnimationWeights, ScanlineAnimationOrientation } from "@thewaver/ss-components-react";

export type ScanlineAnimationExampleProps = {
    src: string;
    lineCount: number;
    orientation: ScanlineAnimationOrientation;
    weightType: CellAnimationWeights.OriginFreeWeightType;
    animationDurationMs: number;
    animationIterationDelayMs: number;
    playback: readonly [boolean, (isPlaying: boolean) => void];
};
