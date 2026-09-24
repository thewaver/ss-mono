import type { Signal } from "solid-js";

import type {
    AccessorProps,
    CellAnimationBreakpointOpts,
    CellAnimationFinalFrame,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    CellAnimationPlaybackOpts,
    CellAnimationWeights,
    WeightOpts,
} from "@thewaver/ss-components";
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
    playbackSignal: Signal<boolean>;
}>;

export type CellAnimationSourcedExampleProps = CellAnimationExampleProps & AccessorProps<{ src: string }>;
