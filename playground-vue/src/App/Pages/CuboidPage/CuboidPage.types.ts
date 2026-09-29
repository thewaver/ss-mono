import type { CuboidController, CuboidSize } from "@thewaver/ss-components-vue";

export type CuboidExampleProps = {
    "size": CuboidSize;
    "transitionDurationMs": number;
    "yaw": number;
    "onUpdate:yaw"?: (value: number) => void;
    "pitch": number;
    "onUpdate:pitch"?: (value: number) => void;
};

export type CuboidWanderingExampleProps = CuboidExampleProps & {
    turnIntervalMs: number | undefined;
};

export type CuboidUprightExampleProps = CuboidExampleProps & {
    "isUpright": boolean;
    "isDraggable": boolean;
    "controller": CuboidController | undefined;
    "onUpdate:controller"?: (value: CuboidController | undefined) => void;
};
