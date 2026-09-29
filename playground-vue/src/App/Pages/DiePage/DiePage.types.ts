import type { DieShape } from "@thewaver/ss-components-vue";

export type DieExampleProps = {
    "shape": DieShape;
    "size": number;
    "rollDurationMs": number;
    "tumbleCount": number;
    "face": number;
    "onUpdate:face"?: (value: number) => void;
};
