import type { IcicleNode } from "@thewaver/ss-components-vue";

export type IcicleExampleProps = {
    "columnCount": number;
    "zoomDurationMs": number;
    "focus": IcicleNode<string>;
    "onUpdate:focus"?: (value: IcicleNode<string>) => void;
};
