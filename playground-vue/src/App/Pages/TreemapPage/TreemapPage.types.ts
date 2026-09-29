import type { TreemapNode } from "@thewaver/ss-components-vue";

export type TreemapExampleProps = {
    "zoomDurationMs": number;
    "branch": TreemapNode<string>;
    "onUpdate:branch"?: (value: TreemapNode<string>) => void;
};
