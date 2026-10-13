import type { VNodeChild } from "vue";

import type { BaseTreemapProps, TreemapNode, TreemapTileState } from "@thewaver/ss-components";

export type TreemapProps<T> = BaseTreemapProps<T> & {
    /**
     * The branch whose children fill the treemap. Both sides write it: the treemap when a branch is activated or
     * Escape is pressed, the consumer to move it from outside — which is how a way back up is drawn. Leave it unbound
     * and the treemap keeps it itself, starting at the root. A node that is not a branch of the current tree shows the
     * root.
     */
    "branch"?: TreemapNode<T>;
    /** Receives the treemap's own zooms, which is what `v-model:branch` binds. */
    "onUpdate:branch"?: (branch: TreemapNode<T>) => void;
};

export type TreemapSlots<T> = {
    /** Draws one tile, and is told where it sits and what it holds. */
    renderTile: (props: { node: TreemapNode<T>; state: TreemapTileState }) => VNodeChild;
};
