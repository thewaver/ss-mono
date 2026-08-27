import type { AccessorProps, InteractionFlags, TreeNodeFlags } from "@thewaver/ss-components";

export type TreeNodeContentProps = AccessorProps<{
    flags: InteractionFlags<TreeNodeFlags>;
    detail?: string;
}>;

export type TreeNodePendingProps = AccessorProps<{
    depth: number;
}>;
