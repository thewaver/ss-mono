import type { AnchorHTMLAttributes, Component, ComponentPublicInstance, VNodeChild } from "vue";

import type {
    BaseMultiTreeCbs,
    BaseSingleTreeCbs,
    BaseTreeCbs,
    BaseTreeValues,
    InteractionFlags,
    TreeConnectorDefs,
    TreeNodeRecord,
    TreeNodeRenderProps,
    TreeRecordRow,
} from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionTooltipDefs,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type TreeLinkProps = AnchorHTMLAttributes & {
    /** Where the link goes. */
    href: string;
};

export type TreeNode<T> = TreeNodeRecord<T, InteractionTooltipDefs<TreeNodeRenderProps<T>>>;

export type TreeRow<T> = TreeRecordRow<T, InteractionTooltipDefs<TreeNodeRenderProps<T>>>;

export type TreeNodeItemProps = InteractionControlProps<TreeNodeRenderProps> & {
    /** How deep this node sits, as assistive technology counts it — from one rather than from zero. */
    level: number;
    /** This node's place among its siblings, counting from one. */
    position: number;
    /** How many siblings this node has, so a reader can be told it is the third of five. */
    setSize: number;
    /** Where this node navigates to, for a tree of links rather than of choices. */
    href: string | undefined;
    /** The component to draw a navigating node with. Its `$el` is what the tree focuses and listens on. */
    linkComponent?: Component<TreeLinkProps>;
    /** Whether the tree ticks several nodes, so this node says it is checked rather than selected. */
    isMultiple: boolean;
    /** Runs when this node is pressed, handed the press so the tree can tell where on the node it landed. */
    onActivate: (e: MouseEvent) => void;
};

export type TreeSharedProps<T> = BaseTreeValues &
    BaseTreeCbs<T> & {
        /**
         * The component to draw navigating nodes with, for a tree of links rather than of choices. Its `$el` is what the
         * tree focuses and listens on.
         */
        "linkComponent"?: Component<TreeLinkProps>;
        /** The nodes, as a tree rather than a flat list. */
        "nodes": TreeNode<T>[];
        /**
         * Which nodes are open, by value. Both sides write it: the tree when a branch is expanded or collapsed, the
         * consumer to open or close branches from outside. Leave it out and the tree keeps the state itself, starting with
         * every branch closed.
         */
        "expanded"?: T[];
        /** Receives the branches left open after one is expanded or collapsed, which is what `v-model:expanded` binds. */
        "onUpdate:expanded"?: (value: T[]) => void;
        /** The text a node is found by when the reader types, where that is not its visible text. */
        "computeCustomText"?: (node: TreeNode<T>) => string;
    };

export type TreeProps<T> = TreeSharedProps<T> &
    BaseSingleTreeCbs<T> & {
        /**
         * Which node is selected. Both sides write it: the tree when a node is activated, the consumer to select one
         * from outside. Leave it out and the tree keeps the selection itself, starting with nothing selected. A node
         * activated then is still selected, still announced as selected and still the tree's single tab stop, even
         * though nobody outside is told; `onSelectionChange` still runs.
         */
        "value"?: T | undefined;
        /** Receives the node a press or a key has selected, which is what `v-model:value` binds. */
        "onUpdate:value"?: (value: T | undefined) => void;
    };

export type MultiTreeProps<T> = TreeSharedProps<T> &
    BaseMultiTreeCbs<T> & {
        /**
         * Which nodes are ticked. Both sides write it: the tree when a node is ticked, the consumer to tick nodes from
         * outside. Ticking a folder ticks everything inside it that is not disabled, and a folder shows `"mixed"` when
         * only some of it is. Leave it out and the tree keeps the state itself, starting with nothing ticked.
         */
        "checked"?: T[];
        /** Receives every ticked value after a node is ticked, which is what `v-model:checked` binds. */
        "onUpdate:checked"?: (value: T[]) => void;
    };

export type TreeCompositeProps<T> = TreeSharedProps<T> &
    BaseSingleTreeCbs<T> &
    BaseMultiTreeCbs<T> &
    Pick<TreeProps<T>, "value" | "onUpdate:value"> &
    Pick<MultiTreeProps<T>, "checked" | "onUpdate:checked"> & {
        /** Whether the tree ticks several nodes rather than selecting one. */
        isMultiple: boolean;
    };

export type MultiTreeSlots<T> = {
    /**
     * Draws one node. It is handed the interaction state and where the node sits in the tree, and a ref to put on
     * the part that opens and closes a folder — usually its arrow. With it, pressing that part opens or closes the
     * folder and pressing anywhere else selects or ticks the node; without it, one press on a folder does both.
     */
    renderNode: (props: {
        node: TreeNode<T>;
        renderProps: InteractionFlags<TreeNodeRenderProps<T>>;
        setExpanderRef: (target: Element | ComponentPublicInstance | null) => void;
    }) => VNodeChild;
    /** Draws what stands in for a branch's children while they are still being fetched. */
    renderPendingChildren?: (props: { node: TreeNode<T>; depth: number }) => VNodeChild;
    /**
     * Draws the marker that slides to the node under the pointer, or the one holding focus, behind it — drawn under the
     * selection's marker where both are given. It fades out while neither is on a node.
     */
    renderHighlightFloater?: (props: { visibilityTarget: 0 | 1; transitionDurationMs: number }) => VNodeChild;
    /**
     * Draws the line from a node up to its parent, across the whole box the tree is laid out in, under the nodes.
     * It is handed both nodes' placements, so it can draw the line between them. Refused without `computeLayout`,
     * since an indented tree has no placements to draw between.
     */
    renderConnector?: (defs: TreeConnectorDefs<T>) => VNodeChild;
};

export type TreeSlots<T> = MultiTreeSlots<T> & {
    /**
     * Draws the marker that slides to the selected node, behind it. The fade is handed in rather than applied: the
     * marker fades out while nothing is selected or the selected node is hidden inside a closed branch, and in a tree
     * that only draws what is on screen, while the selected node is scrolled away.
     */
    renderSelectionFloater?: (props: { visibilityTarget: 0 | 1; transitionDurationMs: number }) => VNodeChild;
};
