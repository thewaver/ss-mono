import type { Signal } from "solid-js";

import type { AccessorProps, CuboidController, CuboidSize } from "@thewaver/ss-components";

export type CuboidExampleProps = AccessorProps<{
    size: CuboidSize;
    transitionDurationMs: number;
    yawSignal: Signal<number>;
    pitchSignal: Signal<number>;
}>;

export type CuboidWanderingExampleProps = CuboidExampleProps &
    AccessorProps<{
        turnIntervalMs: number | undefined;
    }>;

export type CuboidUprightExampleProps = CuboidExampleProps &
    AccessorProps<{
        isUpright: boolean;
        isDraggable: boolean;
        controllerSignal: Signal<CuboidController | undefined>;
    }>;
