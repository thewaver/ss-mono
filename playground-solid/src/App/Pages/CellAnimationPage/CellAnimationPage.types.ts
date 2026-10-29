import type { Signal } from "solid-js";

import type {
    AccessorProps,
    CellAnimationBreakpointOpts,
    CellAnimationFinalFrame,
    CellAnimationFn,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    CellAnimationPlaybackOpts,
    CellAnimationWeights,
    SVGColorMixing,
    SignalSource,
    WeightOpts,
} from "@thewaver/ss-components-solid";
import type { CSSAnimationValues, Index2d } from "@thewaver/ss-utils";

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

export type GpuCellAnimationProps = AccessorProps<{
    src: string;
    cellCount: Index2d;
    origin: Index2d;
    breakpointOpts?: CellAnimationBreakpointOpts;
    playbackOpts?: CellAnimationPlaybackOpts;
    animationDurationMs?: number;
    animationIterationCount?: number;
    animationIterationDelayMs?: number;
    finalFrame?: CellAnimationFinalFrame;
    playback?: SignalSource<boolean>;
    progress?: Signal<number>;
    animation: CellAnimationFn;
    isChannels?: boolean;
    colorMixing?: SVGColorMixing;
    computeCellWeights?: (count: Index2d) => number[][];
    computeRootAnimation?: (timeline: number) => CSSAnimationValues;
    onIterationEnd?: () => void;
}>;
