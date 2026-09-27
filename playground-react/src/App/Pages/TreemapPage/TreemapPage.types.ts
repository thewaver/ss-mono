import type { TreemapNode } from "@thewaver/ss-components-react";

export type TreemapExampleProps = {
    zoomDurationMs: number;
    branchState: readonly [TreemapNode<string>, (value: TreemapNode<string>) => void];
};
