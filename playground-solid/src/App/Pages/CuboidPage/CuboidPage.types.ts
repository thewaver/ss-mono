import type { Signal } from "solid-js";

import type { AccessorProps, CuboidController, CuboidSize } from "@thewaver/ss-components-solid";

export type CuboidExampleProps = AccessorProps<{
    size: CuboidSize;
    transitionDurationMs: number;
    yaw: Signal<number>;
    pitch: Signal<number>;
}>;

export type CuboidWanderingExampleProps = CuboidExampleProps &
    AccessorProps<{
        turnIntervalMs: number | undefined;
    }>;

export type CuboidUprightExampleProps = CuboidExampleProps &
    AccessorProps<{
        isUpright: boolean;
        isDraggable: boolean;
        controller: Signal<CuboidController | undefined>;
    }>;
