import type { SunburstNode } from "@thewaver/ss-components-react";

export type SunburstExampleProps = {
    ringCount: number;
    zoomDurationMs: number;
    branchState: readonly [SunburstNode<string>, (value: SunburstNode<string>) => void];
};
