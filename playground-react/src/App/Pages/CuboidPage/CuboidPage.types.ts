import type { CuboidController, CuboidSize } from "@thewaver/ss-components-react";

export type CuboidExampleProps = {
    size: CuboidSize;
    transitionDurationMs: number;
    yaw: readonly [number, (value: number) => void];
    pitch: readonly [number, (value: number) => void];
};

export type CuboidWanderingExampleProps = CuboidExampleProps & {
    turnIntervalMs: number | undefined;
};

export type CuboidUprightExampleProps = CuboidExampleProps & {
    isUpright: boolean;
    isDraggable: boolean;
    controller: readonly [CuboidController | undefined, (value: CuboidController | undefined) => void];
};
