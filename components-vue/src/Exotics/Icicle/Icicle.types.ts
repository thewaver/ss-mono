import type { VNodeChild } from "vue";

import type { IcicleCellState, IcicleNode } from "@thewaver/ss-components";

export type IcicleProps<T> = {
    /** Names the icicle for assistive technology. */
    "ariaLabel": string;
    /** How many columns fit across the icicle: the one in view and the levels under it. */
    "columnCount"?: number;
    /** How long a zoom takes. `0` jumps straight to the new view, which is the route for reduced motion. */
    "zoomDurationMs"?: number;
    /**
     * The whole tree. A leaf's height comes from its `weight` and a branch's from the total of its children, so a
     * weight set on a branch is ignored. A child weighing nothing gets no cell.
     */
    "root": IcicleNode<T>;
    /**
     * The node in view, filling the first column from top to bottom. Both sides write it: the icicle when a cell is
     * activated — any cell, a leaf included — when the cell in view is activated again, which goes up to its parent,
     * or when Escape is pressed; the consumer to move it from outside. Leave it unbound and the icicle keeps it
     * itself, starting at the root. A node that is not in the current tree shows the root.
     */
    "focus"?: IcicleNode<T>;
    /** Receives the icicle's own zooms, which is what `v-model:focus` binds. */
    "onUpdate:focus"?: (focus: IcicleNode<T>) => void;
};

export type IcicleSlots<T> = {
    /** Draws one cell, and is told where it sits at this moment, which changes on every frame of a zoom. */
    renderCell: (props: { node: IcicleNode<T>; state: IcicleCellState }) => VNodeChild;
};
