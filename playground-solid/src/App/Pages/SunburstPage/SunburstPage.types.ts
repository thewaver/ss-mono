import type { AccessorProps, SignalSource, SunburstNode } from "@thewaver/ss-components-solid";

export type SunburstExampleProps = AccessorProps<{
    ringCount: number;
    zoomDurationMs: number;
    branch: SignalSource<SunburstNode<string>>;
}>;
