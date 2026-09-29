import type { SunburstNode } from "@thewaver/ss-components-vue";

export type SunburstExampleProps = {
    "ringCount": number;
    "zoomDurationMs": number;
    "branch": SunburstNode<string>;
    "onUpdate:branch"?: (value: SunburstNode<string>) => void;
};
