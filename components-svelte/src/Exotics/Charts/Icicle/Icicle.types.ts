import type { Snippet } from "svelte";

import type { BaseIcicleProps, IcicleCellState, IcicleNode } from "@thewaver/ss-components";

export type IcicleProps<T> = BaseIcicleProps<T> & {
    /**
     * The node in view, filling the first column from top to bottom, and how to change it. Both sides write it: the
     * icicle when a cell is activated — any cell, a leaf included — when the cell in view is activated again, which
     * goes up to its parent, or when Escape is pressed; the consumer to move it from outside. Leave it out and the
     * icicle keeps it itself, starting at the root. A node that is not in the current tree shows the root.
     * Bind it with `bind:focus` to drive or follow it, to a variable declared with `$state.raw`: a node is found by
     * identity, and `$state` would hand over a watched copy of it instead.
     */
    focus?: IcicleNode<T>;
    /** Draws one cell, and is told where it sits at this moment, which changes on every frame of a zoom. */
    renderCell: Snippet<[node: IcicleNode<T>, state: IcicleCellState]>;
};
