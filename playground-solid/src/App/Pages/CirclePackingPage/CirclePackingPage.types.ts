import type { AccessorProps, CirclePackingNode, SignalSource } from "@thewaver/ss-components-solid";

export type CirclePackingExampleProps = AccessorProps<{
    padding: number;
    zoomDurationMs: number;
    branch: SignalSource<CirclePackingNode<string>>;
}>;
