import type { DieShape } from "@thewaver/ss-components-vue";

export type DieExampleProps = {
    "shape": DieShape;
    "size": number;
    "rollDurationMs": number;
    "settleDurationMs": number;
    "tumbleCount": number;
    "face": number;
    "onUpdate:face"?: (value: number) => void;
};

export type IconCloudExampleProps = {
    "shape": DieShape;
    "size": number;
    "idleDelayMs": number | undefined;
    "settleDurationMs": number;
    "momentumMs": number;
    "face": number;
    "onUpdate:face"?: (value: number) => void;
    "autoSpin": boolean;
    "onUpdate:autoSpin"?: (value: boolean) => void;
};
