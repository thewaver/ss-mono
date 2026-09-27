import type {
    CellAnimationBreakpointOpts,
    CellAnimationFinalFrame,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    CellAnimationPlaybackOpts,
    CellAnimationWeights,
    WeightOpts,
} from "@thewaver/ss-components-react";
import type { Index2d } from "@thewaver/ss-utils";

export type CellAnimationExampleProps = {
    cellCount: Index2d;
    originType: CellAnimationOrigins.OriginType;
    weightType: CellAnimationWeights.WeightType;
    weightOpts: WeightOpts;
    breakpointOpts: CellAnimationBreakpointOpts;
    playbackOpts: CellAnimationPlaybackOpts;
    animationType: CellAnimationKeyframes.AnimationType;
    animationDurationMs: number;
    animationIterationCount: number;
    animationIterationDelayMs: number;
    finalFrame: CellAnimationFinalFrame;
    playbackState: readonly [boolean, (isPlaying: boolean) => void];
};

export type CellAnimationSourcedExampleProps = CellAnimationExampleProps & {
    src: string;
    progressState?: readonly [number, (progress: number) => void];
};
