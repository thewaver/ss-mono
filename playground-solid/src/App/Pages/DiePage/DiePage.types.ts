import type { AccessorProps, DieShape, SignalSource } from "@thewaver/ss-components-solid";

export type DieExampleProps = AccessorProps<{
    shape: DieShape;
    size: number;
    rollDurationMs: number;
    tumbleCount: number;
    face: SignalSource<number>;
}>;
