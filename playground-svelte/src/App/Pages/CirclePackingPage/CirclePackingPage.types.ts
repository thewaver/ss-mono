import type { CirclePackingNode } from "@thewaver/ss-components-svelte";

export type CirclePackingExampleProps = {
    padding: number;
    zoomDurationMs: number;
    branch: CirclePackingNode<string>;
};
