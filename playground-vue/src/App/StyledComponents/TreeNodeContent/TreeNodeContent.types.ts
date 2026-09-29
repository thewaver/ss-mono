import type { InteractionFlags, TreeNodeRenderProps } from "@thewaver/ss-components-vue";

export type TreeNodeContentProps = {
    renderProps: InteractionFlags<TreeNodeRenderProps>;
    detail?: string;
    hasExamples?: boolean;
};

export type TreeNodePendingProps = {
    depth: number;
};
