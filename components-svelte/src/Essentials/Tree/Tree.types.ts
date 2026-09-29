import type { Component, Snippet } from "svelte";
import type { HTMLAnchorAttributes } from "svelte/elements";

import type {
    InteractionFlags,
    PlacementLayoutFn,
    ProximityEffectFn,
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

export type TreeNode<T> = TreeNodeRecord<T, InteractionTooltipDefs<TreeNodeRenderProps>>;

export type TreeRow<T> = TreeRecordRow<T, InteractionTooltipDefs<TreeNodeRenderProps>>;

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
    /** Runs when this node is activated, by pointer or by key. */
    onActivate: () => void;
};

export type TreeProps<T> = {
    /**
     * Names the tree for assistive technology. It is required because nothing else can name it, and a reader landing
     * on an unnamed tree is told only that it is one.
     */
    ariaLabel: string;
    /** The component to draw navigating nodes with, for a tree of links rather than of choices. */
    linkComponent?: Component<TreeLinkProps>;
    /**
     * Guesses how tall a node will be before it is drawn, which is what lets a long tree render only what is on
     * screen.
     */
    computeEstimatedNodeHeight?: (index: number) => number;
    /** The nodes, as a tree rather than a flat list. */
    nodes: TreeNode<T>[];
    /** Arranges the nodes, for a tree drawn as something other than an indented run. */
    computeLayout?: PlacementLayoutFn;
    /** What the nodes do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /**
     * Which node is selected. Bind it with `bind:value`; both sides write it: the tree when a node is activated, the
     * consumer to select one from outside. Leave it unbound and the tree keeps the selection itself, starting with
     * nothing selected. A node activated then is still selected, still announced as selected and still the tree's
     * single tab stop, even though nobody outside is told; `onSelectionChange` still runs.
     */
    value?: T;
    /**
     * Which nodes are open, by value. Bind it with `bind:expanded`; both sides write it: the tree when a branch is
     * expanded or collapsed, the consumer to open or close branches from outside. Leave it unbound and the tree keeps
     * the state itself, starting with every branch closed.
     */
    expanded?: T[];
    /** The text a node is found by when the reader types, where that is not its visible text. */
    computeCustomText?: (node: TreeNode<T>) => string;
    /** Draws one node. It is handed the interaction state and where the node sits in the tree. */
    renderNode: Snippet<[node: TreeNode<T>, renderProps: InteractionFlags<TreeNodeRenderProps>]>;
    /** Draws what stands in for a branch's children while they are still being fetched. */
    renderPendingChildren?: Snippet<[node: TreeNode<T>, depth: number]>;
    /** Runs when a different node is selected. */
    onSelectionChange?: (value: T) => void;
};
