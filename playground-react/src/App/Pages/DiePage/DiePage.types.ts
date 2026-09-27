import type { DieShape } from "@thewaver/ss-components-react";

export type DieExampleProps = {
    shape: DieShape;
    size: number;
    rollDurationMs: number;
    tumbleCount: number;
    faceState: readonly [number, (value: number) => void];
};
