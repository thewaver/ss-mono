import type { Accessor, JSX } from "solid-js";

import type { Rect } from "@thewaver/ss-utils";

import type { AccessorProps, MaybeAccessor, SignalSource } from "../../Utils/typeUtils";

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

export type TreemapProps<T> = AccessorProps<{
    /** Names the treemap for assistive technology. */
    ariaLabel: string;
    /** How long a zoom takes. `0` jumps straight to the new level, which is the route for reduced motion. */
    zoomDurationMs?: number;
}> & {
    /**
     * The whole tree. A leaf's area comes from its `weight` and a branch's from the total of its children, so a weight
     * set on a branch is ignored. A child weighing nothing gets no tile.
     */
    root: MaybeAccessor<TreemapNode<T>>;
    /**
     * The branch whose children fill the treemap. Both sides write it: the treemap when a branch is activated or Escape
     * is pressed, the consumer to move it from outside — which is how a way back up is drawn. Leave it out and the
     * treemap keeps it itself, starting at the root. A node that is not a branch of the current tree shows the root.
     */
    branchSignal?: SignalSource<TreemapNode<T>>;
    /** Draws one tile, and is told where it sits and what it holds. */
    renderTile: (getNode: Accessor<TreemapNode<T>>, getState: Accessor<TreemapTileState>) => JSX.Element;
};
