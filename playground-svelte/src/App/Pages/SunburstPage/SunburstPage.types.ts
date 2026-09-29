import type { SunburstNode } from "@thewaver/ss-components-svelte";

export type SunburstExampleProps = {
    ringCount: number;
    zoomDurationMs: number;
    branch: SunburstNode<string>;
};
