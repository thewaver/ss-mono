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
    nodeSize: Size2d;
    layerGap?: number;
    crossGap?: number;
    orientation?: BracketOrientation;
    rootSide?: BracketRootSide;
    ariaLabel: string;
}> & {
    root: MaybeAccessor<BracketNode<T>>;
    renderNode: (getNode: Accessor<BracketNode<T>>, getState: Accessor<BracketNodeState>) => JSX.Element;
    renderConnector?: (getDefs: Accessor<BracketConnectorDefs>) => JSX.Element;
    onActivate?: (value: T) => void;
};
