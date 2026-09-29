import type { CirclePackingNode } from "@thewaver/ss-components-react";

export type CirclePackingExampleProps = {
    padding: number;
    zoomDurationMs: number;
    branch: readonly [CirclePackingNode<string>, (value: CirclePackingNode<string>) => void];
};
