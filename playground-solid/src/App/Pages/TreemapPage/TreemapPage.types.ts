import type { AccessorProps, SignalSource, TreemapNode } from "@thewaver/ss-components-solid";

export type TreemapExampleProps = AccessorProps<{
    zoomDurationMs: number;
    branchSignal: SignalSource<TreemapNode<string>>;
}>;
