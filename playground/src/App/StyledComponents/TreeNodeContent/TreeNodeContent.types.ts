import type { AccessorProps, InteractionFlags, TreeNodeRenderProps } from "@thewaver/ss-components";

export type TreeNodeContentProps = AccessorProps<{
    renderProps: InteractionFlags<TreeNodeRenderProps>;
    detail?: string;
}>;

export type TreeNodePendingProps = AccessorProps<{
    depth: number;
}>;
