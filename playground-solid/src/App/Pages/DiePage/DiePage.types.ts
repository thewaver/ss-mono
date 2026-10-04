import type { AccessorProps, DieShape, SignalSource } from "@thewaver/ss-components-solid";

export type DieExampleProps = AccessorProps<{
    shape: DieShape;
    size: number;
    rollDurationMs: number;
    settleDurationMs: number;
    tumbleCount: number;
    face: SignalSource<number>;
}>;

export type IconCloudExampleProps = AccessorProps<{
    shape: DieShape;
    size: number;
    idleDelayMs: number | undefined;
    settleDurationMs: number;
    momentumMs: number;
    face: SignalSource<number>;
    autoSpin: SignalSource<boolean>;
}>;
