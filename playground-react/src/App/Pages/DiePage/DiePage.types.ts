import type { DieShape } from "@thewaver/ss-components-react";

export type DieExampleProps = {
    shape: DieShape;
    size: number;
    rollDurationMs: number;
    settleDurationMs: number;
    tumbleCount: number;
    face: readonly [number, (value: number) => void];
};

export type IconCloudExampleProps = {
    shape: DieShape;
    size: number;
    idleDelayMs: number | undefined;
    settleDurationMs: number;
    momentumMs: number;
    face: readonly [number, (value: number) => void];
    autoSpin: readonly [boolean, (value: boolean) => void];
};
