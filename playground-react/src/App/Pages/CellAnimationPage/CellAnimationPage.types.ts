import type {
    CellAnimationFinalFrame,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    SliceAnimationBreakpointOpts,
    SliceAnimationPlaybackOpts,
    SliceAnimationRenderer,
    SliceAnimationWeights,
    WeightOpts,
} from "@thewaver/ss-components-react";
import type { Index2d } from "@thewaver/ss-utils";

export type CellAnimationExampleProps = {
    cellCount: Index2d;
    originType: CellAnimationOrigins.OriginType;
    weightType: SliceAnimationWeights.WeightType;
    weightOpts: WeightOpts;
    breakpointOpts: SliceAnimationBreakpointOpts;
    playbackOpts: SliceAnimationPlaybackOpts;
    animationType: CellAnimationKeyframes.AnimationType;
    animationDurationMs: number;
    animationIterationCount: number;
    animationIterationDelayMs: number;
    finalFrame: CellAnimationFinalFrame;
    playback: readonly [boolean, (isPlaying: boolean) => void];
    renderer?: SliceAnimationRenderer;
};

export type CellAnimationSourcedExampleProps = CellAnimationExampleProps & {
    src: string;
    progress?: readonly [number, (progress: number) => void];
};
