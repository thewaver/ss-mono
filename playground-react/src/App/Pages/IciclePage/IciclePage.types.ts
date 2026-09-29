import type { IcicleNode } from "@thewaver/ss-components-react";

export type IcicleExampleProps = {
    columnCount: number;
    zoomDurationMs: number;
    focus: readonly [IcicleNode<string>, (value: IcicleNode<string>) => void];
};
