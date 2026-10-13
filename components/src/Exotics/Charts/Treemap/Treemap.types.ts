import type { Rect, Store } from "@thewaver/ss-utils";

export type TreemapNode<T> = {
    value: T;
    weight?: number;
    children?: TreemapNode<T>[];
};

export type TreemapTile<T> = {
    node: TreemapNode<T>;
    weight: number;
    rect: Rect;
};

export type TreemapZoom = "in" | "out";

export type TreemapTransition<T> = {
    zoom: TreemapZoom;
    leavingTiles: TreemapTile<T>[];
    focusRect: Rect;
    durationMs: number;
};

export type TreemapBox = {
    left: string;
    top: string;
    width: string;
    height: string;
};

export type TreemapKeyAction<T> = { kind: "zoom"; node: T } | { kind: "move"; node: T };

export type TreemapZoomClock = Store<number> & {
    start: (durationMs: number) => void;
    stop: () => void;
};

export type TreemapTileState = {
    /** Where the tile sits once it has settled, in pixels from the treemap's top left corner. */
    rect: Rect;
    /** The tile's own weight for a leaf, or everything under it for a branch. */
    weight: number;
    /** Whether the tile has children, and so can be zoomed into. */
    isBranch: boolean;
    /** Whether the tile is on its way out during a zoom rather than part of the level being shown. */
    isLeaving: boolean;
};

export type BaseTreemapValues<T> = {
    /** Names the treemap for assistive technology. */
    ariaLabel: string;
    /** How long a zoom takes. `0` jumps straight to the new level, which is the route for reduced motion. */
    zoomDurationMs?: number;
    /**
     * The whole tree. A leaf's area comes from its `weight` and a branch's from the total of its children, so a weight
     * set on a branch is ignored. A child weighing nothing gets no tile.
     */
    root: TreemapNode<T>;
};

export type BaseTreemapProps<T> = BaseTreemapValues<T>;
