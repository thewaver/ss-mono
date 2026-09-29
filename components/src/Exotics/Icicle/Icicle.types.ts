import type { Rect } from "@thewaver/ss-utils";

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
