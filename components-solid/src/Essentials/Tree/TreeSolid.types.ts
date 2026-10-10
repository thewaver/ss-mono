import type { Accessor, Component, JSX } from "solid-js";

import type {
    FlatRow,
    InteractionFlags,
    PlacementLayoutFn,
    ProximityEffectFn,
    TreeNodeRecord,
    TreeNodeRenderProps,
} from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionTooltipDefs,
} from "../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, MaybeAccessor, SignalSource } from "../../Utils/typeUtils";

export type TreeLinkProps = JSX.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type TreeNode<T> = TreeNodeRecord<T, InteractionTooltipDefs<TreeNodeRenderProps<T>>>;

export type TreeRow<T> = FlatRow<TreeNode<T>>;

export type TreeNodeItemProps = AccessorProps<
    InteractionControlProps<TreeNodeRenderProps> & {
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
    }
>;

export type TreeProps<T> = AccessorProps<{
    /**
     * Names the tree for assistive technology. It is required because nothing else can name it, and a reader landing on an
     * unnamed tree is told only that it is one.
     */
    ariaLabel: string;
    /** The component to draw navigating nodes with, for a tree of links rather than of choices. */
    linkComponent?: Component<TreeLinkProps>;
    /**
     * Guesses how tall a node will be before it is drawn, which is what lets a long tree render only what is on screen.
     */
    computeEstimatedNodeHeight?: (index: number) => number;
    /** How long either marker takes to slide from one node to the next, and to fade. */
    floaterTransitionDurationMs?: number;
    /**
     * Draws the marker that slides to the selected node, behind it. The fade is handed in rather than applied: the
     * marker fades out while nothing is selected or the selected node is hidden inside a closed branch, and in a tree
     * that only draws what is on screen, while the selected node is scrolled away.
     */
    renderSelectionFloater?: (getVisibilityTarget: () => 0 | 1, getTransitionDurationMs: () => number) => JSX.Element;
    /**
     * Draws the marker that slides to the node under the pointer, or the one holding focus, behind it — drawn under the
     * selection's marker where both are given. It fades out while neither is on a node.
     */
    renderHighlightFloater?: (getVisibilityTarget: () => 0 | 1, getTransitionDurationMs: () => number) => JSX.Element;
}> & {
    /** The nodes, as a tree rather than a flat list. */
    nodes: MaybeAccessor<TreeNode<T>[]>;
    /** Arranges the nodes, for a tree drawn as something other than an indented run. */
    computeLayout?: PlacementLayoutFn;
    /** What the nodes do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /**
     * Which node is selected. Both sides write it: the tree when a node is activated, the consumer to select one from
     * outside. Leave it out and the tree keeps the selection itself, starting with nothing selected. A node activated
     * then is still selected, still announced as selected and still the tree's single tab stop, even though nobody
     * outside is told; `onSelectionChange` still runs.
     */
    value?: SignalSource<T | undefined>;
    /**
     * Which nodes are open, by value. Both sides write it: the tree when a branch is expanded or collapsed, the
     * consumer to open or close branches from outside. Leave it out and the tree keeps the state itself, starting
     * with every branch closed.
     */
    expanded?: SignalSource<T[]>;
    /** The text a node is found by when the reader types, where that is not its visible text. */
    computeCustomText?: (node: TreeNode<T>) => string;
    /** Draws one node. It is handed the interaction state and where the node sits in the tree. */
    renderNode: (
        getNode: Accessor<TreeNode<T>>,
        getRenderProps: () => InteractionFlags<TreeNodeRenderProps<T>>,
    ) => JSX.Element;
    /** Draws what stands in for a branch's children while they are still being fetched. */
    renderPendingChildren?: (getNode: Accessor<TreeNode<T>>, getDepth: () => number) => JSX.Element;
    /** Runs when a different node is selected. */
    onSelectionChange?: (value: T) => void;
};
