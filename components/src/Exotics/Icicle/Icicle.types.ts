import type { Accessor, JSX } from "solid-js";

import type { Rect } from "@thewaver/ss-utils";

import type { AccessorProps, MaybeAccessor, SignalSource } from "../../Utils/typeUtils";

export type IcicleNode<T> = {
    value: T;
    weight?: number;
    children?: IcicleNode<T>[];
};

export type IcicleSpan = {
    start: number;
    end: number;
    column: number;
};

export type IcicleStep = "up" | "down" | "toParent" | "toChildren" | "first" | "last";

export type IcicleCellState = {
    /** Where the cell sits at this moment, in pixels from the icicle's top left corner. */
    rect: Rect;
    /** The cell's own weight for a leaf, or everything under it for a branch. */
    weight: number;
    /** Whether the cell has children. */
    isBranch: boolean;
    /** Whether the cell is the one in view, filling the first column. Activating it goes back up a level. */
    isFocus: boolean;
    /** Whether the cell is still there once the current zoom settles, rather than on its way out. */
    isInView: boolean;
};

export type IcicleProps<T> = AccessorProps<{
    /** Names the icicle for assistive technology. */
    ariaLabel: string;
    /** How many columns fit across the icicle: the one in view and the levels under it. */
    columnCount?: number;
    /** How long a zoom takes. `0` jumps straight to the new view, which is the route for reduced motion. */
    zoomDurationMs?: number;
}> & {
    /**
     * The whole tree. A leaf's height comes from its `weight` and a branch's from the total of its children, so a
     * weight set on a branch is ignored. A child weighing nothing gets no cell.
     */
    root: MaybeAccessor<IcicleNode<T>>;
    /**
     * The node in view, filling the first column from top to bottom. Both sides write it: the icicle when a cell is
     * activated — any cell, a leaf included — when the cell in view is activated again, which goes up to its parent, or
     * when Escape is pressed; the consumer to move it from outside. Leave it out and the icicle keeps it itself,
     * starting at the root. A node that is not in the current tree shows the root.
     */
    focusSignal?: SignalSource<IcicleNode<T>>;
    /** Draws one cell, and is told where it sits at this moment, which changes on every frame of a zoom. */
    renderCell: (getNode: Accessor<IcicleNode<T>>, getState: Accessor<IcicleCellState>) => JSX.Element;
};
