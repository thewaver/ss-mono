import type { CuboidController, CuboidSize } from "@thewaver/ss-components-svelte";

export type CuboidExampleProps = {
    size: CuboidSize;
    transitionDurationMs: number;
    yaw: number;
    pitch: number;
};

export type CuboidWanderingExampleProps = CuboidExampleProps & {
    turnIntervalMs: number | undefined;
};

export type CuboidUprightExampleProps = CuboidExampleProps & {
    isUpright: boolean;
    isDraggable: boolean;
    controller: CuboidController | undefined;
};
