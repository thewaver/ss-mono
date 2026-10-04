import type { DieShape } from "@thewaver/ss-components-svelte";

export type DieExampleProps = {
    shape: DieShape;
    size: number;
    rollDurationMs: number;
    settleDurationMs: number;
    tumbleCount: number;
    face: number;
};

export type IconCloudExampleProps = {
    shape: DieShape;
    size: number;
    idleDelayMs: number | undefined;
    settleDurationMs: number;
    momentumMs: number;
    face: number;
    autoSpin: boolean;
};
