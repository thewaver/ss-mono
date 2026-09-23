import type { Accessor, JSX } from "solid-js";

import type { Point2d, Size2d } from "@thewaver/ss-utils";

import type { AccessorProps, MaybeAccessor } from "../../Utils/typeUtils";

export type BracketNode<T> = {
    value: T;
    children?: BracketNode<T>[];
    isDisabled?: boolean;
};

export type BracketOrientation = "horizontal" | "vertical";

export type BracketRootSide = "start" | "end";

export type BracketStep = "toRoot" | "toLeaves" | "previous" | "next" | "first" | "last";

export type BracketPlacement = {
    id: string;
    parentId: string | undefined;
    childIds: string[];
    layer: number;
    cross: number;
    isDisabled: boolean;
};

export type BracketLayout = {
    placements: BracketPlacement[];
    layerCount: number;
    leafCount: number;
};

export type BracketConnectorDefs = {
    /** Unique in the document, so a painter can key a gradient or a marker on it without clashing with another board. */
    id: string;
    /** The node this line arrives at, the one nearer the root. */
    parentId: string;
    /** The node this line leaves from, the one that feeds the parent. */
    childId: string;
    /** Which way the board runs, so a painter knows which axis the bend belongs on. */
    orientation: BracketOrientation;
    /** Where the line leaves the parent: the middle of the edge facing its children. */
    from: Point2d;
    /** Where the line meets the child: the middle of the edge facing the root. */
    to: Point2d;
    /** Whether the child is the focused node or one of the nodes on its way to the root, so the whole path can be drawn apart. */
    isOnFocusedRoute: boolean;
};

export type BracketNodeState = {
    /** Where the node sits: its layer, its place across it and its neighbors' ids. */
    placement: BracketPlacement;
    /** Whether this node holds focus. */
    isFocused: boolean;
    /** Whether this node holds focus or is one of the nodes between it and the root, so a whole path can light up. */
    isOnFocusedRoute: boolean;
};

export type BracketProps<T> = AccessorProps<{
    /** How large one node is. */
    nodeSize: Size2d;
    /** The space between one round and the next. */
    layerGap?: number;
    /** The space between two nodes in the same round. */
    crossGap?: number;
    /** Whether the rounds run across the page or down it. */
    orientation?: BracketOrientation;
    /** Which end the final holds, and so which way the rounds read. */
    rootSide?: BracketRootSide;
    /** Names the bracket for assistive technology. */
    ariaLabel: string;
    /** How thick the strip holding the layer headers is: its height when the rounds run across, its width when they run down. Ignored without `renderLayerHeader`. */
    layerHeaderSize?: number;
    /**
     * Draws the header above one layer, handed the layer counting from the root, so `0` is the final. Given,
     * each layer becomes its own list named by its header, and a strip opens along the board's leading edge
     * that follows `orientation` and `rootSide` with the layers.
     */
    renderLayerHeader?: (layer: number) => JSX.Element;
}> & {
    /** The final, with the rounds that feed it hanging off it as children. */
    root: MaybeAccessor<BracketNode<T>>;
    /** Draws one node, and is told where it sits in the bracket. */
    renderNode: (getNode: Accessor<BracketNode<T>>, getState: Accessor<BracketNodeState>) => JSX.Element;
    /** Draws the line between a node and the one it feeds. */
    renderConnector?: (getDefs: Accessor<BracketConnectorDefs>) => JSX.Element;
    /** Runs when a node is activated, handed its value and where it sits, so two nodes with the same value can be told apart. */
    onActivate?: (value: T, placement: BracketPlacement) => void;
};
