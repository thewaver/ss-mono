import type { Rect, Span } from "@thewaver/ss-utils";

export type IcicleNode<T> = {
    value: T;
    weight?: number;
    children?: IcicleNode<T>[];
};

export type IcicleSpan = Span & {
    column: number;
};

export type IcicleStep = "up" | "down" | "to_parent" | "to_children" | "first" | "last";

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

export type BaseIcicleValues<T> = {
    /** Names the icicle for assistive technology. */
    ariaLabel: string;
    /** How many columns fit across the icicle: the one in view and the levels under it. */
    columnCount?: number;
    /** How long a zoom takes. `0` jumps straight to the new view, which is the route for reduced motion. */
    zoomDurationMs?: number;
    /**
     * The whole tree. A leaf's height comes from its `weight` and a branch's from the total of its children, so a
     * weight set on a branch is ignored. A child weighing nothing gets no cell.
     */
    root: IcicleNode<T>;
};

export type BaseIcicleProps<T> = BaseIcicleValues<T>;
