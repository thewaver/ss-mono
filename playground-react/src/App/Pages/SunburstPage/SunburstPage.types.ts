import type { SunburstNode } from "@thewaver/ss-components-react";

export type SunburstExampleProps = {
    ringCount: number;
    zoomDurationMs: number;
    branch: readonly [SunburstNode<string>, (value: SunburstNode<string>) => void];
};
