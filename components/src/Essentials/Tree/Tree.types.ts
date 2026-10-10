import type { FlatRow } from "../../Abstracts/Flattener/Flattener.types";

export type TreeNodeRenderProps<T = unknown> = {
    /**
     * The item this node was built from, so whatever is drawn for the node — its tooltip, say — can tell which one
     * it is for without a function of its own made per node.
     */
    value: T;
    /**
     * Whether this node can hold children, which is what separates a folder from a leaf even when the folder is empty.
     */
    isBranch: boolean;
    /** Whether this node is open. */
    isExpanded: boolean;
    /** Whether this node's children are still being fetched. */
    isPending: boolean;
    /** Whether this node is the selected one. */
    isSelected: boolean;
    /** How deep this node sits, counting from the roots, so a consumer can indent it. */
    depth: number;
};

export type TreeNodeRecord<T, TTooltipDefs> = {
    value: T;
    href?: string;
    children?: TreeNodeRecord<T, TTooltipDefs>[];
    hasMoreChildren?: boolean;
    isDisabled?: boolean;
    isReachableWhenDisabled?: boolean;
    tooltipDefs?: TTooltipDefs;
};

export type TreeRecordRow<T, TTooltipDefs> = FlatRow<TreeNodeRecord<T, TTooltipDefs>>;

export type TreeKeyAction<T, TTooltipDefs> =
    | { kind: "claim" }
    | { kind: "expandSiblings"; row: TreeRecordRow<T, TTooltipDefs> }
    | { kind: "focus"; row: TreeRecordRow<T, TTooltipDefs> }
    | { kind: "expand"; row: TreeRecordRow<T, TTooltipDefs> }
    | { kind: "collapse"; row: TreeRecordRow<T, TTooltipDefs> }
    | { kind: "activate"; row: TreeRecordRow<T, TTooltipDefs> }
    | { kind: "click"; row: TreeRecordRow<T, TTooltipDefs> };
