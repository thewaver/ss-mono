import type { Accessor, Component, JSX } from "solid-js";

import type { FlatRow } from "../../Abstracts/Flattener/Flattener.types";
import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { PlacementLayoutFn } from "../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";
import type {
    InteractionControlProps,
    InteractionTooltipDefs,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps, MaybeAccessor, SignalSource } from "../../Utils/typeUtils";

export type TreeNodeRenderProps = {
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

export type TreeLinkProps = JSX.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type TreeNode<T> = {
    value: T;
    href?: string;
    children?: TreeNode<T>[];
    hasMoreChildren?: boolean;
    isDisabled?: boolean;
    isReachableWhenDisabled?: boolean;
    tooltipDefs?: InteractionTooltipDefs<TreeNodeRenderProps>;
};

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
    /** Names the tree for assistive technology. */
    ariaLabel?: string;
    /** The component to draw navigating nodes with, for a tree of links rather than of choices. */
    linkComponent?: Component<TreeLinkProps>;
    /**
     * Guesses how tall a node will be before it is drawn, which is what lets a long tree render only what is on screen.
     */
    computeEstimatedNodeHeight?: (index: number) => number;
}> & {
    /** The nodes, as a tree rather than a flat list. */
    nodes: MaybeAccessor<TreeNode<T>[]>;
    /** Arranges the nodes, for a tree drawn as something other than an indented run. */
    computeLayout?: PlacementLayoutFn;
    /** What the nodes do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /** Which node is selected. It is the only thing that selects one. */
    valueSignal: SignalSource<T | undefined>;
    /** Which nodes are open. It is the only thing that opens or closes them. */
    expandedSignal: SignalSource<T[]>;
    /** The text a node is found by when the reader types, where that is not its visible text. */
    computeCustomText?: (node: TreeNode<T>) => string;
    /** Draws one node. It is handed the interaction state and where the node sits in the tree. */
    renderNode: (
        getNode: Accessor<TreeNode<T>>,
        getRenderProps: () => InteractionFlags<TreeNodeRenderProps>,
    ) => JSX.Element;
    /** Draws what stands in for a branch's children while they are still being fetched. */
    renderPendingChildren?: (getNode: Accessor<TreeNode<T>>, getDepth: () => number) => JSX.Element;
    /** Runs when a different node is selected. */
    onSelectionChange?: (value: T) => void;
};
