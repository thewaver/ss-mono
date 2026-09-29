import type { IcicleNode } from "@thewaver/ss-components-svelte";

export type IcicleExampleProps = {
    columnCount: number;
    zoomDurationMs: number;
    focus: IcicleNode<string>;
};
