import type { TreemapNode } from "@thewaver/ss-components-react";

export type TreemapExampleProps = {
    zoomDurationMs: number;
    branch: readonly [TreemapNode<string>, (value: TreemapNode<string>) => void];
};
