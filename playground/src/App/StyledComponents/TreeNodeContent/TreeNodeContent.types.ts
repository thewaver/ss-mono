import type { InteractionFlags, TreeConnectorDefs, TreeNodeRenderProps } from "@thewaver/ss-components";

export type BaseTreeNodeContentValues = {
    renderProps: InteractionFlags<TreeNodeRenderProps>;
    detail?: string;
    hasExamples?: boolean;
    isGliding?: boolean;
    hasCheckbox?: boolean;
};

export type BaseTreeNodeContentProps = BaseTreeNodeContentValues;

export type BaseTreeNodePendingValues = {
    depth: number;
};

export type BaseTreeNodePendingProps = BaseTreeNodePendingValues;

export type BaseTreeConnectorValues = {
    defs: TreeConnectorDefs<unknown>;
};

export type BaseTreeConnectorProps = BaseTreeConnectorValues;
