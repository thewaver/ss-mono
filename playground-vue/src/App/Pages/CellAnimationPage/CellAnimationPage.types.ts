import type {
    CellAnimationFinalFrame,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    SliceAnimationBreakpointOpts,
    SliceAnimationPlaybackOpts,
    SliceAnimationRenderer,
    SliceAnimationWeights,
    WeightOpts,
} from "@thewaver/ss-components-vue";
import type { Index2d } from "@thewaver/ss-utils";

export type CellAnimationExampleProps = {
    "cellCount": Index2d;
    "originType": CellAnimationOrigins.OriginType;
    "weightType": SliceAnimationWeights.WeightType;
    "weightOpts": WeightOpts;
    "breakpointOpts": SliceAnimationBreakpointOpts;
    "playbackOpts": SliceAnimationPlaybackOpts;
    "animationType": CellAnimationKeyframes.AnimationType;
    "animationDurationMs": number;
    "animationIterationCount": number;
    "animationIterationDelayMs": number;
    "finalFrame": CellAnimationFinalFrame;
    "renderer"?: SliceAnimationRenderer;
    "playback": boolean;
    "onUpdate:playback"?: (isPlaying: boolean) => void;
};

export type CellAnimationSharedProps = Omit<CellAnimationExampleProps, "playback" | "onUpdate:playback">;

export type CellAnimationSourcedExampleProps = CellAnimationExampleProps & {
    "src": string;
    "progress"?: number;
    "onUpdate:progress"?: (progress: number) => void;
};
