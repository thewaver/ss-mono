import type { AccessorProps, SignalSource, SunburstNode } from "@thewaver/ss-components";

export type SunburstExampleProps = AccessorProps<{
    ringCount: number;
    zoomDurationMs: number;
    branchSignal: SignalSource<SunburstNode<string>>;
}>;
