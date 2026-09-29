import type { CellAnimationWeights, ScanlineAnimationOrientation } from "@thewaver/ss-components-vue";

export type ScanlineAnimationExampleProps = {
    "src": string;
    "lineCount": number;
    "orientation": ScanlineAnimationOrientation;
    "weightType": CellAnimationWeights.OriginFreeWeightType;
    "animationDurationMs": number;
    "animationIterationDelayMs": number;
    "playback": boolean;
    "onUpdate:playback"?: (isPlaying: boolean) => void;
};
