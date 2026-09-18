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
    id: string;
    parentId: string;
    childId: string;
    orientation: BracketOrientation;
    from: Point2d;
    to: Point2d;
};

export type BracketNodeState = {
    placement: BracketPlacement;
    isFocused: boolean;
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
}> & {
    /** The final, with the rounds that feed it hanging off it as children. */
    root: MaybeAccessor<BracketNode<T>>;
    /** Draws one node, and is told where it sits in the bracket. */
    renderNode: (getNode: Accessor<BracketNode<T>>, getState: Accessor<BracketNodeState>) => JSX.Element;
    /** Draws the line between a node and the one it feeds. */
    renderConnector?: (getDefs: Accessor<BracketConnectorDefs>) => JSX.Element;
    /** Runs when a node is activated. */
    onActivate?: (value: T) => void;
};
