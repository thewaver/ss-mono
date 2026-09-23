import type { AccessorProps, DieShape, SignalSource } from "@thewaver/ss-components";

export type DieExampleProps = AccessorProps<{
    shape: DieShape;
    size: number;
    rollDurationMs: number;
    tumbleCount: number;
    faceSignal: SignalSource<number>;
}>;
