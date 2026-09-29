import type { DieShape } from "@thewaver/ss-components-svelte";

export type DieExampleProps = {
    shape: DieShape;
    size: number;
    rollDurationMs: number;
    tumbleCount: number;
    face: number;
};
