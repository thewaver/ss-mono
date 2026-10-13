import type { Accessor, JSX } from "solid-js";

import type { BaseIcicleValues, IcicleCellState, IcicleNode } from "@thewaver/ss-components";

import type { AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type IcicleProps<T> = AccessorValues<BaseIcicleValues<T>> & {
    /**
     * The node in view, filling the first column from top to bottom. Both sides write it: the icicle when a cell is
     * activated — any cell, a leaf included — when the cell in view is activated again, which goes up to its parent, or
     * when Escape is pressed; the consumer to move it from outside. Leave it out and the icicle keeps it itself,
     * starting at the root. A node that is not in the current tree shows the root.
     */
    focus?: SignalSource<IcicleNode<T>>;
    /** Draws one cell, and is told where it sits at this moment, which changes on every frame of a zoom. */
    renderCell: (getNode: Accessor<IcicleNode<T>>, getState: Accessor<IcicleCellState>) => JSX.Element;
};
