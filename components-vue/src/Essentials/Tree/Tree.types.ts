import type { AnchorHTMLAttributes, Component, VNodeChild } from "vue";

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
    /** Runs when this node is activated, by pointer or by key. */
    onActivate: () => void;
};

export type TreeProps<T> = {
    /**
     * Names the tree for assistive technology. It is required because nothing else can name it, and a reader landing
     * on an unnamed tree is told only that it is one.
     */
    "ariaLabel": string;
    /**
     * The component to draw navigating nodes with, for a tree of links rather than of choices. Its `$el` is what the
     * tree focuses and listens on.
     */
    "linkComponent"?: Component<TreeLinkProps>;
    /**
     * Guesses how tall a node will be before it is drawn, which is what lets a long tree render only what is on
     * screen.
     */
    "computeEstimatedNodeHeight"?: (index: number) => number;
    /** How long either marker takes to slide from one node to the next, and to fade. */
    "floaterTransitionDurationMs"?: number;
    /** The nodes, as a tree rather than a flat list. */
    "nodes": TreeNode<T>[];
    /** Arranges the nodes, for a tree drawn as something other than an indented run. */
    "computeLayout"?: PlacementLayoutFn;
    /** What the nodes do as the pointer nears them. */
    "computeEffect"?: ProximityEffectFn;
    /**
     * Which node is selected. Both sides write it: the tree when a node is activated, the consumer to select one from
     * outside. Leave it out and the tree keeps the selection itself, starting with nothing selected. A node activated
     * then is still selected, still announced as selected and still the tree's single tab stop, even though nobody
     * outside is told; `onSelectionChange` still runs.
     */
    "value"?: T | undefined;
    /** Receives the node a press or a key has selected, which is what `v-model:value` binds. */
    "onUpdate:value"?: (value: T | undefined) => void;
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
    /** Runs when a different node is selected. */
    "onSelectionChange"?: (value: T) => void;
};

export type TreeSlots<T> = {
    /** Draws one node. It is handed the interaction state and where the node sits in the tree. */
    renderNode: (props: { node: TreeNode<T>; renderProps: InteractionFlags<TreeNodeRenderProps<T>> }) => VNodeChild;
    /** Draws what stands in for a branch's children while they are still being fetched. */
    renderPendingChildren?: (props: { node: TreeNode<T>; depth: number }) => VNodeChild;
    /**
     * Draws the marker that slides to the selected node, behind it. The fade is handed in rather than applied: the
     * marker fades out while nothing is selected or the selected node is hidden inside a closed branch, and in a tree
     * that only draws what is on screen, while the selected node is scrolled away.
     */
    renderSelectionFloater?: (props: { visibilityTarget: 0 | 1; transitionDurationMs: number }) => VNodeChild;
    /**
     * Draws the marker that slides to the node under the pointer, or the one holding focus, behind it — drawn under the
     * selection's marker where both are given. It fades out while neither is on a node.
     */
    renderHighlightFloater?: (props: { visibilityTarget: 0 | 1; transitionDurationMs: number }) => VNodeChild;
};
