import type { Point2d, Size2d } from "@thewaver/ss-utils";

export type BracketNode<T> = {
    value: T;
    children?: BracketNode<T>[];
    isDisabled?: boolean;
};

export type BracketOrientation = "horizontal" | "vertical";

export type BracketRootSide = "start" | "end";

export type BracketView = "tree" | "family";

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

export type BracketExtent = Pick<BracketLayout, "layerCount" | "leafCount">;

export type BracketGeometryOpts = {
    nodeSize: Size2d;
    layerGap: number;
    crossGap: number;
    orientation: BracketOrientation;
    rootSide: BracketRootSide;
    headerExtent: number;
};

export type BracketGeometry = BracketGeometryOpts & {
    isHorizontal: boolean;
    layerExtent: number;
    crossExtent: number;
    layerPitch: number;
    crossPitch: number;
    layerSpan: number;
    boardSize: Size2d;
};

export type BracketBox = {
    left: number;
    top: number;
    width: number;
    height: number;
};

export type BracketFrame = {
    left: number;
    top: number;
    opacity: number;
    isFolded: boolean;
};

export type BracketArrangement = {
    nodes: Record<string, BracketFrame>;
    headers: BracketFrame[];
    boardSize: Size2d;
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

export type BracketLayerHeaderState = {
    /**
     * Whether this layer is the current round: the middle row of the family the board names, which the family view
     * shows and the tree view follows with focus. One layer at most, so a header can mark it while the rounds either
     * side of it stay in view.
     */
    isCurrent: boolean;
};
