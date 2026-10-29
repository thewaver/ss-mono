import type { Signal } from "solid-js";

import type {
    AccessorProps,
    CellAnimationFinalFrame,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    SignalSource,
    SliceAnimationBreakpointOpts,
    SliceAnimationPlaybackOpts,
    SliceAnimationRenderer,
    SliceAnimationWeights,
    WeightOpts,
} from "@thewaver/ss-components-solid";
import type { Index2d } from "@thewaver/ss-utils";

export type CellAnimationExampleProps = AccessorProps<{
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
    playback: SignalSource<boolean>;
    progress?: Signal<number>;
    renderer?: SliceAnimationRenderer;
}>;

export type CellAnimationSourcedExampleProps = CellAnimationExampleProps & AccessorProps<{ src: string }>;
