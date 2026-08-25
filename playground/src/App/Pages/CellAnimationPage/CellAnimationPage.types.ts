import type { Signal } from "solid-js";

import type {
    AccessorProps,
    CellAnimationBreakpoints,
    CellAnimationKeyframes,
    CellAnimationOrigins,
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
    animationType: CellAnimationKeyframes.AnimationType;
    animationDurationMs: number;
    animationIterationDelayMs: number;
    playbackSignal: Signal<boolean>;
}>;

export type CellAnimationSourcedExampleProps = CellAnimationExampleProps & AccessorProps<{ src: string }>;
