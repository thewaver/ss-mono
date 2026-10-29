import type { ScanlineAnimationOrientation, SliceAnimationWeights } from "@thewaver/ss-components-vue";

export type ScanlineAnimationExampleProps = {
    "src": string;
    "lineCount": number;
    "orientation": ScanlineAnimationOrientation;
    "weightType": SliceAnimationWeights.OriginFreeWeightType;
    "animationDurationMs": number;
    "animationIterationDelayMs": number;
    "playback": boolean;
    "onUpdate:playback"?: (isPlaying: boolean) => void;
    "progress"?: number;
    "onUpdate:progress"?: (progress: number) => void;
};
