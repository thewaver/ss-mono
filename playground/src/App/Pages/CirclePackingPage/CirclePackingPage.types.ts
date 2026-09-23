import type { AccessorProps, CirclePackingNode, SignalSource } from "@thewaver/ss-components";

export type CirclePackingExampleProps = AccessorProps<{
    padding: number;
    zoomDurationMs: number;
    branchSignal: SignalSource<CirclePackingNode<string>>;
}>;
