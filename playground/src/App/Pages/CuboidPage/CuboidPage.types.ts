import type { Signal } from "solid-js";

import type { AccessorProps, CuboidSize } from "@thewaver/ss-components";

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
