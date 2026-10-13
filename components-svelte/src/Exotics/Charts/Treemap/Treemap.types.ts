import type { Snippet } from "svelte";

import type { BaseTreemapProps, TreemapNode, TreemapTileState } from "@thewaver/ss-components";

export type TreemapProps<T> = BaseTreemapProps<T> & {
    /**
     * The branch whose children fill the treemap, and how to change it. Both sides write it: the treemap when a branch
     * is activated or Escape is pressed, the consumer to move it from outside — which is how a way back up is drawn.
     * Leave it out and the treemap keeps it itself, starting at the root. A node that is not a branch of the current
     * tree shows the root.
     * Bind it with `bind:branch` to drive or follow it, to a variable declared with `$state.raw`: a node is found by
     * identity, and `$state` would hand over a watched copy of it instead.
     */
    branch?: TreemapNode<T>;
    /** Draws one tile, and is told where it sits and what it holds. */
    renderTile: Snippet<[node: TreemapNode<T>, state: TreemapTileState]>;
};
