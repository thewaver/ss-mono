import type { Signal } from "solid-js";

import type {
    AccessorProps,
    CellAnimationBreakpoints,
    CellAnimationFinalFrame,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    CellAnimationPlayback,
    CellAnimationWeights,
    WeightOpts,
} from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

export type CellAnimationExampleProps = AccessorProps<{
    cellCount: Point2d;
    originType: CellAnimationOrigins.OriginType;
    weightType: CellAnimationWeights.WeightType;
    weightOpts: WeightOpts;
    breakpointOpts: CellAnimationBreakpoints.BreakpointOpts;
    playbackOpts: CellAnimationPlayback.PlaybackOpts;
    animationType: CellAnimationKeyframes.AnimationType;
    animationDurationMs: number;
    animationIterationCount: number;
    animationIterationDelayMs: number;
    finalFrame: CellAnimationFinalFrame;
    playbackSignal: Signal<boolean>;
}>;

export type CellAnimationSourcedExampleProps = CellAnimationExampleProps & AccessorProps<{ src: string }>;
