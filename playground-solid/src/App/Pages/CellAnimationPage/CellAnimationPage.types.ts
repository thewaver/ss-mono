import type { Signal } from "solid-js";

import type {
    AccessorProps,
    CellAnimationBreakpointOpts,
    CellAnimationFinalFrame,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    CellAnimationPlaybackOpts,
    CellAnimationWeights,
    SignalSource,
    WeightOpts,
} from "@thewaver/ss-components-solid";
import type { Index2d } from "@thewaver/ss-utils";

export type CellAnimationExampleProps = AccessorProps<{
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
    playback: SignalSource<boolean>;
    progress?: Signal<number>;
}>;

export type CellAnimationSourcedExampleProps = CellAnimationExampleProps & AccessorProps<{ src: string }>;
