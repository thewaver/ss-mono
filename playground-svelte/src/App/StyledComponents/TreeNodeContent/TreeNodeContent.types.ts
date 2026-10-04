import type { InteractionFlags, TreeNodeRenderProps } from "@thewaver/ss-components-svelte";

export type TreeNodeContentProps = {
    renderProps: InteractionFlags<TreeNodeRenderProps>;
    detail?: string;
    hasExamples?: boolean;
    isGliding?: boolean;
};

export type TreeNodePendingProps = {
    depth: number;
};
