import type { InteractionFlags, TreeNodeRenderProps } from "@thewaver/ss-components";

export type BaseTreeNodeContentValues = {
    renderProps: InteractionFlags<TreeNodeRenderProps>;
    detail?: string;
    hasExamples?: boolean;
    isGliding?: boolean;
};

export type BaseTreeNodeContentProps = BaseTreeNodeContentValues;

export type BaseTreeNodePendingValues = {
    depth: number;
};

export type BaseTreeNodePendingProps = BaseTreeNodePendingValues;
