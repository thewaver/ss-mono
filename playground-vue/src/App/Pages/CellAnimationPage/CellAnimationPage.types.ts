import type {
    CellAnimationBreakpointOpts,
    CellAnimationFinalFrame,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    CellAnimationPlaybackOpts,
    CellAnimationWeights,
    WeightOpts,
} from "@thewaver/ss-components-vue";
import type { Index2d } from "@thewaver/ss-utils";

export type CellAnimationExampleProps = {
    "cellCount": Index2d;
    "originType": CellAnimationOrigins.OriginType;
    "weightType": CellAnimationWeights.WeightType;
    "weightOpts": WeightOpts;
    "breakpointOpts": CellAnimationBreakpointOpts;
    "playbackOpts": CellAnimationPlaybackOpts;
    "animationType": CellAnimationKeyframes.AnimationType;
    "animationDurationMs": number;
    "animationIterationCount": number;
    "animationIterationDelayMs": number;
    "finalFrame": CellAnimationFinalFrame;
    "playback": boolean;
    "onUpdate:playback"?: (isPlaying: boolean) => void;
};

export type CellAnimationSharedProps = Omit<CellAnimationExampleProps, "playback" | "onUpdate:playback">;

export type CellAnimationSourcedExampleProps = CellAnimationExampleProps & {
    "src": string;
    "progress"?: number;
    "onUpdate:progress"?: (progress: number) => void;
};
