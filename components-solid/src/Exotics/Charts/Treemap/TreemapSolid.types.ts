import type { Accessor, JSX } from "solid-js";

import type { BaseTreemapValues, TreemapNode, TreemapTileState } from "@thewaver/ss-components";

import type { AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type TreemapProps<T> = AccessorValues<BaseTreemapValues<T>> & {
    /**
     * The branch whose children fill the treemap. Both sides write it: the treemap when a branch is activated or Escape
     * is pressed, the consumer to move it from outside — which is how a way back up is drawn. Leave it out and the
     * treemap keeps it itself, starting at the root. A node that is not a branch of the current tree shows the root.
     */
    branch?: SignalSource<TreemapNode<T>>;
    /** Draws one tile, and is told where it sits and what it holds. */
    renderTile: (getNode: Accessor<TreemapNode<T>>, getState: Accessor<TreemapTileState>) => JSX.Element;
};
