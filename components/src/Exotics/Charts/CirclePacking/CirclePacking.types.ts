export type CirclePackingNode<T> = {
    value: T;
    weight?: number;
    children?: CirclePackingNode<T>[];
};

export type CirclePackingCircle = {
    x: number;
    y: number;
    radius: number;
};

export type CirclePackingView = {
    x: number;
    y: number;
    diameter: number;
};

export type CirclePackingCircleState = {
    /** How far the circle's center is to the right of the drawing's center at this moment, in pixels. */
    x: number;
    /** How far the circle's center is below the drawing's center at this moment, in pixels. */
    y: number;
    /** The circle's radius at this moment, in pixels. */
    radius: number;
    /** The circle's own weight for a leaf, or everything inside it for a branch. */
    weight: number;
    /** Whether the circle has circles inside it, and so can be zoomed into. */
    isBranch: boolean;
    /** Whether the circle sits directly inside the branch in view once the current zoom settles. */
    isInView: boolean;
    /** How deep the circle's node is, counting the root's children as one. */
    depth: number;
};
