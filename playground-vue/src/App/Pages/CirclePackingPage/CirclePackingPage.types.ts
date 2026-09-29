import type { CirclePackingNode } from "@thewaver/ss-components-vue";

export type CirclePackingExampleProps = {
    "padding": number;
    "zoomDurationMs": number;
    "branch": CirclePackingNode<string>;
    "onUpdate:branch"?: (value: CirclePackingNode<string>) => void;
};
