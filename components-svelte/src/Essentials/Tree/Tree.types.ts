import type { Component, Snippet } from "svelte";
import type { HTMLAnchorAttributes } from "svelte/elements";

import type {
    BaseMultiTreeCbs,
    BaseSingleTreeCbs,
    BaseTreeCbs,
    BaseTreeValues,
    InteractionFlags,
    TreeConnectorDefs,
    TreeConnectorNeedsLayout,
    TreeNodeRecord,
    TreeNodeRenderProps,
    TreeRecordRow,
} from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionTooltipDefs,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types.js";

export type TreeLinkProps = HTMLAnchorAttributes & {
    /**
     * Where the link goes. Spread every prop onto the anchor: they carry the tree's hold on the element, which is what
     * it focuses and listens on.
     */
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
    /** The component to draw a navigating node with. */
    linkComponent?: Component<TreeLinkProps>;
    /** Whether the tree ticks several nodes, so this node says it is checked rather than selected. */
    isMultiple: boolean;
    /** Runs when this node is pressed, handed the press so the tree can tell where on the node it landed. */
    onActivate: (e: MouseEvent) => void;
};

export type TreeSharedProps<T> = BaseTreeValues &
    BaseTreeCbs<T> & {
        /** The component to draw navigating nodes with, for a tree of links rather than of choices. */
        linkComponent?: Component<TreeLinkProps>;
        /**
         * Draws the marker that slides to the node under the pointer, or the one holding focus, behind it — drawn under the
         * selection's marker where both are given. It fades out while neither is on a node.
         */
        renderHighlightFloater?: Snippet<[visibilityTarget: 0 | 1, transitionDurationMs: number]>;
        /** The nodes, as a tree rather than a flat list. */
        nodes: TreeNode<T>[];
        /**
         * Which nodes are open, by value. Bind it with `bind:expanded`; both sides write it: the tree when a branch is
         * expanded or collapsed, the consumer to open or close branches from outside. Leave it unbound and the tree keeps
         * the state itself, starting with every branch closed.
         */
        expanded?: T[];
        /** The text a node is found by when the reader types, where that is not its visible text. */
        computeCustomText?: (node: TreeNode<T>) => string;
        /**
         * Draws one node. It is handed the interaction state and where the node sits in the tree, and a ref to put on
         * the part that opens and closes a folder — usually its arrow. With it, pressing that part opens or closes the
         * folder and pressing anywhere else selects or ticks the node; without it, one press on a folder does both.
         */
        renderNode: Snippet<
            [
                node: TreeNode<T>,
                renderProps: InteractionFlags<TreeNodeRenderProps<T>>,
                setExpanderRef: (element: HTMLElement) => void,
            ]
        >;
        /** Draws what stands in for a branch's children while they are still being fetched. */
        renderPendingChildren?: Snippet<[node: TreeNode<T>, depth: number]>;
        /**
         * Draws the line from a node up to its parent, across the whole box the tree is laid out in, under the nodes.
         * It is handed both nodes' placements, so it can draw the line between them. Refused without `computeLayout`,
         * since an indented tree has no placements to draw between.
         */
        renderConnector?: Snippet<[defs: TreeConnectorDefs<T>]>;
    } & TreeConnectorNeedsLayout;

export type TreeProps<T> = TreeSharedProps<T> &
    BaseSingleTreeCbs<T> & {
        /**
         * Draws the marker that slides to the selected node, behind it. The fade is handed in rather than applied: the
         * marker fades out while nothing is selected or the selected node is hidden inside a closed branch, and in a tree
         * that only draws what is on screen, while the selected node is scrolled away.
         */
        renderSelectionFloater?: Snippet<[visibilityTarget: 0 | 1, transitionDurationMs: number]>;
        /**
         * Which node is selected. Bind it with `bind:value`; both sides write it: the tree when a node is activated, the
         * consumer to select one from outside. Leave it unbound and the tree keeps the selection itself, starting with
         * nothing selected. A node activated then is still selected, still announced as selected and still the tree's
         * single tab stop, even though nobody outside is told; `onSelectionChange` still runs.
         */
        value?: T;
    };

export type MultiTreeProps<T> = TreeSharedProps<T> &
    BaseMultiTreeCbs<T> & {
        /**
         * Which nodes are ticked. Bind it with `bind:checked`; both sides write it: the tree when a node is ticked, the
         * consumer to tick nodes from outside. Ticking a folder ticks everything inside it that is not disabled, and a
         * folder shows `"mixed"` when only some of it is. Leave it unbound and the tree keeps the state itself, starting
         * with nothing ticked.
         */
        checked?: T[];
    };

export type TreeCompositeProps<T> = TreeSharedProps<T> &
    BaseSingleTreeCbs<T> &
    BaseMultiTreeCbs<T> &
    Partial<Pick<TreeProps<T>, "renderSelectionFloater" | "value">> &
    Pick<MultiTreeProps<T>, "checked"> & {
        /** Whether the tree ticks several nodes rather than selecting one. */
        isMultiple: boolean;
    };
