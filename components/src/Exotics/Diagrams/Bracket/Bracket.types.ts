import type { Point2d, Size2d } from "@thewaver/ss-utils";

export type BracketNode<T> = {
    value: T;
    children?: BracketNode<T>[];
    isDisabled?: boolean;
};

export type BracketOrientation = "horizontal" | "vertical";

export type BracketRootSide = "start" | "end";

export type BracketStep = "to_root" | "to_leaves" | "previous" | "next" | "first" | "last";

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

export type BaseBracketValues<T> = {
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
    /**
     * How thick the strip holding the layer headers is: its height when the rounds run across, its width when they
     * run down. Ignored without `renderLayerHeader`.
     */
    layerHeaderSize?: number;
    /**
     * How long the window takes to glide to a view the consumer or the controller asks for. A drag, the wheel and a
     * pinch move it at once. `0` jumps, which is the reduced-motion route. Ignored without a view.
     */
    transitionDurationMs?: number;
    /** Whether a drag over the window moves the view. Ignored without a view, since there is no window to move. */
    isPannable?: boolean;
    /** Whether the wheel and a pinch change how much of the board the window shows. Ignored without a view. */
    isZoomable?: boolean;
    /**
     * The closest the window may zoom in, as window pixels per board pixel. `1` stops at the board's own size, and a
     * view asking for a smaller area is widened to it.
     */
    maxScale?: number;
    /**
     * Keeps `family` and the view in step. A family that changes — from focus, the keyboard or the consumer — is
     * framed, gliding there; a drag, the wheel or a pinch that moves the view writes the family it is now showing,
     * the one whose framed view shares the most with it, without moving the view again. While the view is wider than
     * any family, `family` is left as it was, so zooming back in returns to it, and no layer is the current round.
     * Ignored without a view.
     */
    isFollowingFamily?: boolean;
    /**
     * Glides the view to frame the family in it once a drag or a pinch is let go, or the wheel has rested for a fifth
     * of a second, and to the whole board when the view was left wider than any family — so a gesture always ends on
     * one of the two. Ignored without `isFollowingFamily`.
     */
    isSnappingToFamily?: boolean;
    /** The room left around a family when it is framed, in board pixels. Ignored without `isFollowingFamily`. */
    familyMargin?: number;
    /** The final, with the rounds that feed it hanging off it as children. */
    root: BracketNode<T>;
};

export type BaseBracketCbs<T> = {
    /**
     * Runs when a node is activated, handed its value and where it sits, so two nodes with the same value can be told
     * apart.
     */
    onActivate?: (value: T, placement: BracketPlacement) => void;
};

export type BaseBracketProps<T> = BaseBracketValues<T> & BaseBracketCbs<T>;
