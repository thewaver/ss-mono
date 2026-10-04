import type { AccessorProps, InteractionFlags, TreeNodeRenderProps } from "@thewaver/ss-components-solid";

export type TreeNodeContentProps = AccessorProps<{
    renderProps: InteractionFlags<TreeNodeRenderProps>;
    detail?: string;
    hasExamples?: boolean;
    isGliding?: boolean;
}>;

export type TreeNodePendingProps = AccessorProps<{
    depth: number;
}>;
